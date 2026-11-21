import { Injectable } from '@angular/core';
import type { jsPDF } from 'jspdf';
import { CartItem, ClientData } from '../models/cart.model';

const cop = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');
const longDate = (d: Date) =>
  d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

/** Genera y descarga la cotización en PDF. jsPDF se carga "lazy" (solo al pulsar el botón). */
@Injectable({ providedIn: 'root' })
export class QuotePdfService {
  async generate(client: ClientData, items: CartItem[]): Promise<void> {
    const [{ jsPDF }, { autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const quoteNumber = 'COT-' + Date.now().toString().slice(-8);
    const today = new Date();
    const vencimiento = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);

    /* encabezado */
    doc.setFillColor(20, 31, 43);
    doc.rect(0, 0, pageWidth, 80, 'F');
    doc.setTextColor(215, 230, 57);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('PORTAL DE DOTACIONES', 40, 34);
    doc.setTextColor(230, 230, 220);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Confección de dotación industrial en jean · ventas@portaldedotaciones.com · +57 300 000 0000', 40, 50);
    doc.text('Cra. 00 # 00-00, Bogotá, Colombia · NIT 000.000.000-0', 40, 62);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('COTIZACIÓN', pageWidth - 40, 100, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`N°: ${quoteNumber}`, pageWidth - 40, 114, { align: 'right' });
    doc.text(`Fecha: ${longDate(today)}`, pageWidth - 40, 126, { align: 'right' });
    doc.text(`Válida hasta: ${longDate(vencimiento)}`, pageWidth - 40, 138, { align: 'right' });

    /* datos del cliente */
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Datos del cliente', 40, 110);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let y = 124;
    const line = (label: string, value: string) => {
      if (!value) return;
      doc.text(`${label}: ${value}`, 40, y);
      y += 13;
    };
    line('Nombre', client.nombre);
    line('Empresa', client.empresa);
    line('NIT / Cédula', client.nit);
    line('Teléfono', client.telefono);
    line('Correo', client.email);

    /* tabla de productos */
    const rows = items.map((item) => [
      item.label,
      item.size,
      item.addons.length
        ? item.addons.map((a) => `${a.name} (+${cop(a.price)})`).join('\n')
        : 'Sin personalización',
      String(item.qty),
      cop(item.unitPrice),
      cop(item.subtotal),
    ]);

    autoTable(doc, {
      startY: Math.max(y + 20, 160),
      head: [['Prenda', 'Talla', 'Personalización', 'Cant.', 'V. Unitario', 'Subtotal']],
      body: rows,
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 6, valign: 'top' },
      headStyles: { fillColor: [20, 31, 43], textColor: [215, 230, 57], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [242, 238, 226] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 165 },
        3: { cellWidth: 35, halign: 'center' },
        4: { cellWidth: 70, halign: 'right' },
        5: { cellWidth: 70, halign: 'right' },
      },
      margin: { left: 40, right: 40 },
    });

    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
    const totalUnits = items.reduce((s, i) => s + i.qty, 0);
    const totalValue = items.reduce((s, i) => s + i.subtotal, 0);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Total de prendas: ${items.length}`, 40, finalY);
    doc.text(`Unidades totales: ${totalUnits}`, 40, finalY + 13);
    doc.setFillColor(20, 31, 43);
    doc.roundedRect(pageWidth - 210, finalY - 16, 170, 34, 4, 4, 'F');
    doc.setTextColor(215, 230, 57);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(cop(totalValue), pageWidth - 40, finalY + 6, { align: 'right' });
    doc.setFontSize(8);
    doc.setTextColor(230, 230, 220);
    doc.text('TOTAL ESTIMADO (COP)', pageWidth - 40, finalY - 6, { align: 'right' });

    /* notas al pie */
    doc.setTextColor(90, 90, 90);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      [
        '· Cotización válida por 15 días calendario a partir de la fecha de emisión.',
        '· Precios no incluyen costo de envío ni impuestos adicionales, salvo que se indique lo contrario.',
        '· Los tiempos de entrega dependen de la cantidad y personalización solicitada; se confirman al aprobar el pedido.',
        '· Para aprobar esta cotización, responde a este documento o contáctanos por los medios indicados en el encabezado.',
      ],
      40,
      finalY + 50,
      { maxWidth: pageWidth - 80, lineHeightFactor: 1.5 },
    );

    doc.save(`${quoteNumber}_PortalDeDotaciones.pdf`);
  }
}
