package com.example.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.example.service.EmailService;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.time.Duration;

public class SignupPageTest {

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
        void testUserSignup() throws InterruptedException {

                driver.get("http://localhost:8088/signup");

                // Full Name
                driver.findElement(By.id("fullName"))
                                .sendKeys("Tanmay Kanase");

                // Email
                driver.findElement(By.id("email"))
                                .sendKeys("tanmaytest@gmail.com");

                // Send OTP
                driver.findElement(By.xpath("//button[contains(text(),'Send OTP')]"))
                                .click();

                Thread.sleep(3000);

                driver.findElement(
                                By.xpath("//button[contains(text(),'Send OTP')]"))
                                .click();

                Thread.sleep(2000);

                WebElement toast = driver.findElement(By.className("Toastify__toast"));

                String text = toast.getText();

                String otp = text.replaceAll("\\D+", "");

                driver.findElement(By.name("otp"))
                                .sendKeys(otp);
                /*
                 * Since OTP comes from backend/email,
                 * either:
                 * 1. Read it from DB
                 * 2. Mock OTP service
                 * 3. Use test OTP
                 */

                driver.findElement(
                                By.xpath("//button[contains(text(),'Verify OTP')]"))
                                .click();

                Thread.sleep(1000);

                // Password
                driver.findElement(By.id("password"))
                                .sendKeys("Password@123");

                // Confirm Password
                driver.findElement(By.id("confirmPassword"))
                                .sendKeys("Password@123");

                // Phone
                driver.findElement(By.id("phone"))
                                .sendKeys("9876543210");

                // Role
                Select role = new Select(driver.findElement(By.id("role")));
                role.selectByValue("user");

                // Terms checkbox
                driver.findElement(By.id("terms"))
                                .click();

                // Submit
                driver.findElement(
                                By.xpath("//button[contains(text(),'Create Account')]"))
                                .click();

                Thread.sleep(5000);

                Assertions.assertTrue(
                                driver.getCurrentUrl().contains("/"));
        }
}