package com.kiemchung.vtea;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Disabled in CI because it requires a real DB connection")
class VteaApplicationTests {

	@Test
	void contextLoads() {
	}

}
