import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

function getPublicDir(): string {
  const cwd = process.cwd();
  if (existsSync(path.join(cwd, 'public'))) {
    return path.join(cwd, 'public');
  }
  if (existsSync(path.join(cwd, 'frontend', 'public'))) {
    return path.join(cwd, 'frontend', 'public');
  }
  return path.join(cwd, 'public');
}

/**
 * Hàm chuẩn hóa tên file: loại bỏ dấu tiếng Việt, ký tự đặc biệt và nối timestamp
 */
function sanitizeFileName(originalName: string): string {
  const extension = path.extname(originalName) || '.png';
  const baseName = path.basename(originalName, extension);

  const normalized = baseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const safeBase = normalized || 'product';
  return `${safeBase}-${Date.now()}${extension.toLowerCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng chọn file hình ảnh cần tải lên.' },
        { status: 400 }
      );
    }

    // Kiểm tra định dạng file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Định dạng ảnh không hợp lệ (hỗ trợ JPG, PNG, WEBP, GIF).' },
        { status: 400 }
      );
    }

    // Giới hạn kích thước tối đa 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { success: false, message: 'Kích thước ảnh vượt quá giới hạn cho phép (tối đa 5MB).' },
        { status: 400 }
      );
    }

    const safeFolder = folder === 'toppings' ? 'toppings' : 'products';
    const publicDir = getPublicDir();
    const targetDir = path.join(publicDir, 'images', safeFolder);

    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true });
    }

    const uniqueFileName = sanitizeFileName(file.name);
    const filePath = path.join(targetDir, uniqueFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(filePath, buffer);

    const relativeUrl = `/images/${safeFolder}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      fileName: uniqueFileName,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định khi tải ảnh lên server.';
    return NextResponse.json(
      { success: false, message: `Lỗi upload: ${message}` },
      { status: 500 }
    );
  }
}
