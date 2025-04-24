package com.example.utils;

import com.example.model.Booking;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ICalGenerator {

    public static byte[] generateCalendarInvite(Booking booking) throws IOException {
        String calendarData = "BEGIN:VCALENDAR\n" +
                "VERSION:2.0\n" +
                "PRODID:-//ParkEasy//NONSGML v1.0//EN\n" +
                "BEGIN:VEVENT\n" +
                "SUMMARY:Parking Booking at " + booking.getLocation() + "\n" +
                "DESCRIPTION:Booking Slot: " + booking.getSlotNumber() + "\n" +
                "LOCATION:" + booking.getLocation() + "\n" +
                "DTSTART:" + formatDateTime(booking.getStartTime()) + "\n" +
                "DTEND:" + formatDateTime(booking.getEndTime()) + "\n" +
                "END:VEVENT\n" +
                "END:VCALENDAR";

        return calendarData.getBytes(StandardCharsets.UTF_8);
    }

    // 📅 Format: 20250421T180000Z (iCal UTC format)
    private static String formatDateTime(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd'T'HHmmss'Z'");
        return sdf.format(date);
    }
}
