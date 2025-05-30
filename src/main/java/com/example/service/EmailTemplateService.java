package com.example.service;

import org.springframework.stereotype.Service;
import com.example.model.Booking;

@Service
public class EmailTemplateService {

    public String generateBookingTemplate(Booking booking) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>ParkEasy Booking Confirmation</title>
                    <style>
                      body {
                        font-family: "Segoe UI", Roboto, sans-serif;
                        background: linear-gradient(to right, #f4f6f9, #dde6ed);
                        margin: 0;
                        padding: 0;
                      }
                      .email-container {
                        max-width: 650px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border-radius: 14px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                      }
                      .header {
                        background: linear-gradient(135deg, #00b894, #019875);
                        padding: 30px 25px;
                        color: white;
                        text-align: center;
                      }
                      .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: bold;
                      }
                      .header p {
                        margin: 5px 0 0;
                        font-size: 16px;
                      }
                      .content {
                        padding: 30px 35px;
                        color: #333;
                      }
                      .content h2 {
                        margin-top: 0;
                        font-size: 22px;
                        color: #019875;
                      }
                      .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px 30px;
                        margin-top: 20px;
                        background: #f9f9f9;
                        padding: 25px;
                        border-radius: 12px;
                        border: 1px solid #eee;
                      }
                      .info-item {
                        font-size: 15px;
                        color: #444;
                      }
                      .info-label {
                        font-weight: bold;
                        color: #019875;
                      }
                      .footer {
                        padding: 20px 30px;
                        text-align: center;
                        background-color: #fafafa;
                        border-top: 1px solid #eee;
                        color: #777;
                        font-size: 14px;
                      }
                      .footer a {
                        color: #00b894;
                        text-decoration: none;
                        font-weight: 500;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="email-container">
                      <div class="header">
                        <h1>🎉 Booking Confirmed!</h1>
                        <p>Your parking slot is successfully reserved with ParkEasy</p>
                      </div>

                      <div class="content">
                        <h2>Booking Details</h2>
                        <div class="info-grid">
                          <div class="info-item">
                            <div class="info-label">📍 Location</div>
                            <div>%s</div>
                          </div>
                          <div class="info-item">
                            <div class="info-label">🅿️ Slot Number</div>
                            <div>%s</div>
                          </div>
                          <div class="info-item">
                            <div class="info-label">🚗 Vehicle Type</div>
                            <div>%s</div>
                          </div>
                          <div class="info-item">
                            <div class="info-label">🔢 License Plate</div>
                            <div>%s</div>
                          </div>
                          <div class="info-item">
                            <div class="info-label">⏰ Start Time</div>
                            <div>%s</div>
                          </div>
                          <div class="info-item">
                            <div class="info-label">⏳ End Time</div>
                            <div>%s</div>
                          </div>
                          <div class="info-item">
                            <div class="info-label">💰 Amount Paid</div>
                            <div>₹%s</div>
                          </div>
                        </div>

                        <p style="margin-top: 25px">
                          Thank you for choosing <strong>ParkEasy</strong>. We wish you a
                          hassle-free parking experience.
                        </p>
                        <p>For support, contact us anytime.</p>
                        <p>Warm regards,<br /><strong>– The ParkEasy Team</strong></p>
                      </div>

                      <div class="footer">
                        <p><strong>Thank you for choosing ParkEasy!</strong></p>
                        <p>
                          🚦 <em>Quick Reminders:</em><br />
                          • Arrive 10 minutes before your start time.<br />
                          • Display your license plate clearly.<br />
                          • Follow on-site instructions & park responsibly.<br />
                          • Your booking is valid only for the reserved duration.
                        </p>

                        <p style="margin: 15px 0">
                          Need help? Reach out to us at
                          <a href="mailto:support@parkeasy.com">support@parkeasy.com</a>
                          or visit our <a href="https://www.parkeasy.com/help">Help Center</a>.
                        </p>

                        <p style="font-size: 13px; color: #aaa; margin-top: 10px">
                          &copy; 2025 ParkEasy. All rights reserved. <br />
                          <a href="https://www.parkeasy.com" style="color: #00b894"
                            >www.parkeasy.com</a
                          >
                        </p>

                        <p style="margin-top: 12px; font-style: italic; color: #777">
                          Wishing you a stress-free parking experience! 🌟
                        </p>
                      </div>
                    </div>
                  </body>
                </html>
                        """.formatted(
                booking.getLocation(),
                booking.getSlotNumber(),
                booking.getVehicleType(),
                booking.getLicensePlate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getAmountPaid());
    }
}
