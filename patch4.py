import sys

with open('src/utils/pdfGenerator.ts', 'r') as f:
    content = f.read()

import_statement = "import { Order, OrderItem } from '../types';\n"
content = import_statement + content

content = content.replace("export const getWhatsAppText = (order: any, isOrder: boolean = false) => {", "export const getWhatsAppText = (order: Order, isOrder: boolean = false) => {")
content = content.replace("(order.items || []).forEach((it: any) => {", "(order.items || []).forEach((it: OrderItem) => {")
content = content.replace("export const getCancellationWhatsAppText = (cancelledOrder: any) => {", "export const getCancellationWhatsAppText = (cancelledOrder: Order) => {")

with open('src/utils/pdfGenerator.ts', 'w') as f:
    f.write(content)
