package com.example.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import java.time.Duration;

public class LoginPageTest {

        private WebDriver driver;

        @BeforeEach
        void setup() {

                WebDriverManager.chromedriver().setup();

                driver = new ChromeDriver();

                driver.manage().window().maximize();

                driver.manage().timeouts()
                                .implicitlyWait(Duration.ofSeconds(10));
        }

        @AfterEach
        void tearDown() {

                if (driver != null) {
                        driver.quit();
                }
        }

        @Test
        void testInvalidLogin() throws InterruptedException {

                driver.get("http://localhost:8088/signin");

                driver.findElement(By.id("email"))
                                .sendKeys("wrong@gmail.com");

                driver.findElement(By.id("password"))
                                .sendKeys("wrong123");

                driver.findElement(
                                By.xpath("//button[contains(.,'Sign In')]")).click();

                Thread.sleep(2000);

                Assertions.assertTrue(
                                driver.getPageSource()
                                                .contains("User not found"));
        }

        @Test
        void testSuccessfulLogin() throws InterruptedException {

                driver.get("http://localhost:8088/signin");

                driver.findElement(By.id("email"))
                                .sendKeys("tanmaykanase06@gmail.com");

                driver.findElement(By.id("password"))
                                .sendKeys("12345678");

                driver.findElement(
                                By.xpath("//button[contains(.,'Sign In')]")).click();

                Thread.sleep(3000);

                Assertions.assertFalse(
                                driver.getCurrentUrl().contains("signin"));
        }
}