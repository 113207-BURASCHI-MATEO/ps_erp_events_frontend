import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportToPdf(
    data: any[],
    title: string,
    head: string[][],
    rowMapper: (item: any) => any[]
  ): void {
    const doc = new jsPDF();
    /* doc.setFontSize(16);
    doc.text(title, 14, 20); */

    const margin = { top: 10, right: 5, bottom: 5, left: 5 };
    const titleY = margin.top;

    doc.setFontSize(12);
    doc.text(title, margin.left, titleY);

    autoTable(doc, {
      //startY: 30,
      startY: titleY + 10,
      head: head,
      body: data.map(rowMapper),
      margin: margin,
      styles: {
        font: 'helvetica', // 'courier', 'times', etc.
        fontSize: 8,
      },

      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();
        const footerY = pageHeight - 10;

        doc.setFontSize(10);
        doc.text(title, pageSize.width / 2, footerY, { align: 'center' });
      },
    });

    doc.save(`${title}_${this.getToday()}.pdf`);
  }

  exportToExcel(
    data: any[],
    title: string,
    columnMapper: (item: any) => { [key: string]: any }
  ): void {
    const formatted = data.map(columnMapper);

    /* const worksheet = XLSX.utils.json_to_sheet(formatted);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title); */

    const worksheet = XLSX.utils.json_to_sheet(formatted, { cellDates: true });

    worksheet['!cols'] = Object.keys(formatted[0] || {}).map(() => ({
      wch: 15,
    }));
    worksheet['!autofilter'] = {
      ref: worksheet['!ref'] as string
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    XLSX.writeFile(workbook, `${title}_${this.getToday()}.xlsx`);
  }

  private getToday(): string {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }
}
