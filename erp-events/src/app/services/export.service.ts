import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportEmployeesToPdf(employees: Employee[]): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Empleados', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Nombre', 'Apellido', 'Documento', 'Email', 'Puesto']],
      body: employees.map(emp => [
        emp.firstName,
        emp.lastName,
        `${emp.documentType}: ${emp.documentNumber}`,
        emp.email,
        emp.position
      ])
    });

    doc.save(`Empleados_${this.getToday()}.pdf`);
  }

  exportEmployeesToExcel(employees: Employee[]): void {
    const formatted = employees.map(emp => ({
      Nombre: emp.firstName,
      Apellido: emp.lastName,
      Documento: `${emp.documentType}: ${emp.documentNumber}`,
      Email: emp.email,
      Puesto: emp.position
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

    XLSX.writeFile(workbook, `Empleados_${this.getToday()}.xlsx`);
  }

  private getToday(): string {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }
}
