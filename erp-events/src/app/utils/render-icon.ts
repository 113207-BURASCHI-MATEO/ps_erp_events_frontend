export function renderIconField(tipo: string): (params: any) => string {
  return (params: any): string => {
    const valor = params.value;
    let icono = '';
    let color = '';
    let texto = '';

    switch (tipo) {
      case 'eventType':
        ({ icono, color, texto } = getEventTypeIcon(valor));
        break;
      case 'eventStatus':
        ({ icono, color, texto } = getEventStatusIcon(valor));
        break;
      case 'taskStatus':
        ({ icono, color, texto } = getTaskStatusIcon(valor));
        break;
      case 'guestType':
        ({ icono, color, texto } = getGuestTypeIcon(valor));
        break;
      case 'supplierType':
        ({ icono, color, texto } = getSupplierTypeIcon(valor));
        break;
      case 'fileType':
        ({ icono, color, texto } = getFileTypeIcon(valor));
        break;
      case 'fileContentType':
        ({ icono, color, texto } = getFileContentTypeIcon(valor));
        break;
      case 'paymentStatus':
        ({ icono, color, texto } = getPaymentStatusIcon(valor));
        break;
      case 'roleName':
        ({ icono, color, texto } = getRoleDisplayInfo(valor));
        break;
      case 'accessType':
        ({ icono, color, texto } = getAccessTypeIcon(valor));
        break;
      case 'foodRestriction':
        ({ icono, color, texto } = getFoodRestrictionIcon(valor));
        break;
      default:
        icono = 'help_outline';
        color = '#6c757d';
        texto = valor;
    }

    return `
        <span style="display: flex; align-items: center; gap: 6px; color: ${color}">
          <span class="material-icons">${icono}</span>
          <span>${texto}</span>
        </span>
      `;
  };
}

function getEventTypeIcon(type: string) {
  switch (type) {
    case 'CORPORATE':
      return { icono: 'business', color: '#13505B', texto: 'Corporativo' };
    case 'SOCIAL':
      return { icono: 'group', color: '#9FC2CC', texto: 'Social' };
    case 'CULTURAL':
      return { icono: 'museum', color: '#D7D9CE', texto: 'Cultural' };
    case 'SPORTS':
      return { icono: 'sports_soccer', color: '#040404', texto: 'Deportes' };
    case 'ENTERTAINMENT':
      return {
        icono: 'celebration',
        color: '#FF7F11',
        texto: 'Entretenimiento',
      };
    default:
      return { icono: 'help_outline', color: '#040404', texto: type };
  }
}

function getEventStatusIcon(status: string) {
  switch (status) {
    case 'POSTPONED':
      return { icono: 'schedule', color: '#9FC2CC', texto: 'Postpuesto' };
    case 'CONFIRMED':
      return { icono: 'check_circle', color: '#13505B', texto: 'Confirmado' };
    case 'IN_PROGRESS':
      return { icono: 'autorenew', color: '#FF7F11', texto: 'En progreso' };
    case 'CANCELLED':
      return { icono: 'cancel', color: '#D7D9CE', texto: 'Cancelado' };
    case 'SUSPENDED':
      return { icono: 'pause', color: '#13505B', texto: 'Suspendido' };
    case 'FINISHED':
      return { icono: 'done_all', color: '#040404', texto: 'Completado' };
    default:
      return { icono: 'help_outline', color: '#040404', texto: status };
  }
}

function getTaskStatusIcon(status: string) {
  switch (status) {
    case 'PENDING':
      return { icono: 'hourglass_empty', color: '#9FC2CC', texto: 'Pendiente' };
    case 'IN_PROGRESS':
      return { icono: 'loop', color: '#FF7F11', texto: 'En progreso' };
    case 'COMPLETED':
      return { icono: 'check_circle', color: '#13505B', texto: 'Completada' };
    case 'CANCELLED':
      return { icono: 'cancel', color: '#D7D9CE', texto: 'Cancelada' };
    default:
      return { icono: 'help_outline', color: '#040404', texto: status };
  }
}

function getGuestTypeIcon(type: string) {
  switch (type) {
    case 'VIP':
      return { icono: 'star', color: '#FF7F11', texto: 'VIP' };
    case 'REGULAR':
      return { icono: 'person', color: '#9FC2CC', texto: 'Regular' };
    case 'STAFF':
      return { icono: 'badge', color: '#13505B', texto: 'Staff' };
    case 'FAMILY':
      return { icono: 'family_restroom', color: '#D7D9CE', texto: 'Familia' };
    case 'FRIEND':
      return { icono: 'people', color: '#13505B', texto: 'Amigo' };
    case 'GENERAL':
      return { icono: 'group', color: '#9FC2CC', texto: 'General' };
    case 'OTHER':
      return { icono: 'person_outline', color: '#D7D9CE', texto: 'Otro' };
    default:
      return { icono: 'help_outline', color: '#040404', texto: type };
  }
}

function getSupplierTypeIcon(type: string) {
  switch (type) {
    case 'CATERING':
      return { icono: 'restaurant', color: '#FF7F11', texto: 'Catering' };
    case 'DECORACION':
      return { icono: 'brush', color: '#D7D9CE', texto: 'Decoración' };
    case 'SOUND':
      return { icono: 'graphic_eq', color: '#9FC2CC', texto: 'Sonido' };
    case 'GASTRONOMIC':
      return { icono: 'local_dining', color: '#13505B', texto: 'Gastronómico' };
    case 'FURNITURE':
      return { icono: 'weekend', color: '#D7D9CE', texto: 'Mobiliario' };
    case 'ENTERTAINMENT':
      return {
        icono: 'celebration',
        color: '#FF7F11',
        texto: 'Entretenimiento',
      };
    default:
      return { icono: 'help_outline', color: '#040404', texto: type };
  }
}

function getFileTypeIcon(type: string) {
  switch (type) {
    case 'RECEIPT':
      return { icono: 'receipt_long', color: '#FF7F11', texto: 'Recibo' };
    case 'BILLING':
      return { icono: 'request_quote', color: '#D7D9CE', texto: 'Factura' };
    case 'PAYMENT':
      return { icono: 'payments', color: '#9FC2CC', texto: 'Pago' };
    case 'OTHER':
      return { icono: 'description', color: '#13505B', texto: 'Otro' };
    default:
      return { icono: 'help_outline', color: '#040404', texto: type };
  }
}

function getFileContentTypeIcon(type: string) {
  switch (type) {
    case 'application/pdf':
      return { icono: 'picture_as_pdf', color: '#E53935', texto: 'PDF' };
    case 'image/jpeg':
      return { icono: 'image', color: '#64B5F6', texto: 'JPEG' };
    case 'image/png':
      return { icono: 'image', color: '#81C784', texto: 'PNG' };
    case 'image/jpg':
      return { icono: 'image', color: '#BA68C8', texto: 'JPG' };
    case 'text/csv':
      return { icono: 'table_chart', color: '#FBC02D', texto: 'CSV' };
    default:
      return { icono: 'insert_drive_file', color: '#757575', texto: type };
  }
}

function getPaymentStatusIcon(type: string) {
  switch (type) {
    case 'PAID':
      return { icono: 'check_circle', color: '#4CAF50', texto: 'Pagado' };
    case 'PENDING_PAYMENT':
      return { icono: 'hourglass_empty', color: '#FFC107', texto: 'Pendiente' };
    default:
      return { icono: 'help_outline', color: '#9E9E9E', texto: type };
  }
}

function getRoleDisplayInfo(role: string) {
  switch (role) {
    case 'SUPERADMIN':
      return { icono: 'security', color: '#673AB7', texto: 'Superadmin' };
    case 'ADMIN':
      return {
        icono: 'admin_panel_settings',
        color: '#3F51B5',
        texto: 'Administrador',
      };
    case 'SUPERVISOR':
      return {
        icono: 'supervisor_account',
        color: '#03A9F4',
        texto: 'Supervisor',
      };
    case 'EMPLOYEE':
      return { icono: 'person', color: '#4CAF50', texto: 'Empleado' };
    default:
      return { icono: 'help_outline', color: '#9E9E9E', texto: role };
  }
}

export function getAccessTypeIcon(type: string) {
  switch (type) {
    case 'ENTRY':
      return {
        icono: 'toggle_on',
        color: '#4CAF50',
        texto: 'Entrada',
      };
    case 'EXIT':
      return {
        icono: 'toggle_off',
        color: '#F44336',
        texto: 'Salida',
      };
    default:
      return {
        icono: 'help_outline',
        color: '#9E9E9E',
        texto: type ? type : 'Ausente',
      };
  }
}

export function getFoodRestrictionIcon(type: boolean) {
  switch (type) {
    case true:
      return {
        icono: 'verified',
        color: '#4CAF50',
        texto: 'Restricción',
      };
    case false:
      return {
        icono: 'block',
        color: '#F44336',
        texto: 'Sin restricción',
      };
    default:
      return {
        icono: 'help_outline',
        color: '#9E9E9E',
        texto: type ? type : 'Sin información',
      };
  }
}
