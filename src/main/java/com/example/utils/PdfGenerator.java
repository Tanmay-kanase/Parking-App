package com.example.utils;

import com.example.model.Booking;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class PdfGenerator {

    public static byte[] generateReceipt(Booking booking) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, baos);
        document.open();

        // Title
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
        Paragraph title = new Paragraph("ParkEasy Parking Booking Receipt", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(" ")); // Empty line

        // Booking Details Table
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        Font bodyFont = new Font(Font.FontFamily.HELVETICA, 12);

        table.addCell(new PdfPCell(new Phrase("User ID:", headerFont)));
        table.addCell(new PdfPCell(new Phrase(booking.getUserId(), bodyFont)));

        table.addCell(new PdfPCell(new Phrase("Slot Number:", headerFont)));
        table.addCell(new PdfPCell(new Phrase(booking.getSlotNumber(), bodyFont)));

        table.addCell(new PdfPCell(new Phrase("Location:", headerFont)));
        table.addCell(new PdfPCell(new Phrase(booking.getLocation(), bodyFont)));

        table.addCell(new PdfPCell(new Phrase("License Plate:", headerFont)));
        table.addCell(new PdfPCell(new Phrase(booking.getLicensePlate(), bodyFont)));

        table.addCell(new PdfPCell(new Phrase("Vehicle Type:", headerFont)));
        table.addCell(new PdfPCell(new Phrase(booking.getVehicleType(), bodyFont)));

        table.addCell(new PdfPCell(new Phrase("Booking Time:", headerFont)));
        table.addCell(new PdfPCell(new Phrase(booking.getStartTime() + " - " + booking.getEndTime(), bodyFont)));

        table.addCell(new PdfPCell(new Phrase("Amount Paid:", headerFont)));
        table.addCell(new PdfPCell(new Phrase("$" + booking.getAmountPaid(), bodyFont)));

        document.add(table);

        document.add(new Paragraph(" ")); // Empty line

        // QR Code
        try {
            Image qrImage = Image.getInstance(generateQRCodeImage(booking.getSlotId()));
            qrImage.setAlignment(Element.ALIGN_CENTER);
            qrImage.scaleAbsolute(100, 100); // Adjust size as needed
            document.add(qrImage);
        } catch (Exception e) {
            e.printStackTrace();
        }

        document.close();

        return baos.toByteArray();
    }

    private static byte[] generateQRCodeImage(String slotId) throws Exception {
        int width = 200;
        int height = 200;

        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.MARGIN, 1);

        BitMatrix bitMatrix = new MultiFormatWriter().encode(slotId, BarcodeFormat.QR_CODE, width, height, hints);

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                image.setRGB(x, y, (bitMatrix.get(x, y) ? 0x000000 : 0xFFFFFF));
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", baos);
        return baos.toByteArray();
    }
}
