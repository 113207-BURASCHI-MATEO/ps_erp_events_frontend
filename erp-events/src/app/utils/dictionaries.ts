// DocumentType
export const DocumentTypeDictionary: { [key: string]: string } = {
  dni: 'DNI',
  passport: 'Pasaporte',
  cuit: 'CUIT',
};

// Client
export const ClientDictionary: { [key: string]: string } = {
  idclient: 'ID Cliente',
  firstname: 'Nombre',
  lastname: 'Apellido',
  email: 'Email',
  phonenumber: 'Teléfono',
  documenttype: 'Tipo de Documento',
  documentnumber: 'Número de Documento',
  aliascbu: 'Alias CBU',
  events: 'Eventos',
};

// Employee
export const EmployeeDictionary: { [key: string]: string } = {
  idemployee: 'ID Empleado',
  firstname: 'Nombre',
  lastname: 'Apellido',
  documenttype: 'Tipo de Documento',
  documentnumber: 'Número de Documento',
  email: 'Email',
  cuit: 'CUIT',
  birthdate: 'Fecha de Nacimiento',
  aliascbu: 'Alias CBU',
  hiredate: 'Fecha de Contratación',
  position: 'Posición',
  creationdate: 'Fecha de Creación',
  updatedate: 'Fecha de Actualización',
  softdelete: 'Eliminado',
};

// EventType
export const EventTypeDictionary: { [key: string]: string } = {
  corporate: 'Corporativo',
  social: 'Social',
  cultural: 'Cultural',
  entertainment: 'Entretenimiento',
  other: 'Otro',
  sports: 'Deportivo',
};

// EventStatus
export const EventStatusDictionary: { [key: string]: string } = {
  confirmed: 'Confirmado',
  in_progress: 'En Progreso',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
  suspended: 'Suspendido',
  postponed: 'Pospuesto',
};

// Event
export const EventDictionary: { [key: string]: string } = {
  idevent: 'ID Evento',
  title: 'Título',
  description: 'Descripción',
  eventtype: 'Tipo de Evento',
  startdate: 'Fecha de Inicio',
  enddate: 'Fecha de Fin',
  status: 'Estado',
  softdelete: 'Eliminado',
  creationdate: 'Fecha de Creación',
  updatedate: 'Fecha de Actualización',
  client: 'Cliente',
  location: 'Ubicación',
  employeesids: 'IDs de Empleados',
  employees: 'Empleados',
  suppliersids: 'IDs de Proveedores',
  suppliers: 'Proveedores',
  guests: 'Invitados',
  tasks: 'Tareas',
};

// FileType
export const FileTypeDictionary: { [key: string]: string } = {
  receipt: 'Recibo',
  billing: 'Facturación',
  payment: 'Pago',
  other: 'Otro',
};

// ContentType
export const ContentTypeDictionary: { [key: string]: string } = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/jpg': 'JPG',
};

// File
export const FileDictionary: { [key: string]: string } = {
  idfile: 'ID Archivo',
  filetype: 'Tipo de Archivo',
  filename: 'Nombre del Archivo',
  filecontenttype: 'Tipo de Contenido',
  fileurl: 'URL del Archivo',
  reviewnote: 'Nota de Revisión',
  softdelete: 'Eliminado',
  creationdate: 'Fecha de Creación',
  updatedate: 'Fecha de Actualización',
  supplierid: 'ID Proveedor',
  clientid: 'ID Cliente',
  employeeid: 'ID Empleado',
};

// GuestType
export const GuestTypeDictionary: { [key: string]: string } = {
  vip: 'VIP',
  regular: 'Regular',
  staff: 'Personal',
  family: 'Familia',
  friend: 'Amigo',
  other: 'Otro',
  general: 'General',
};

// GuestAccessType
export const GuestAccessTypeDictionary: { [key: string]: string } = {
  entry: 'Entrada',
  exit: 'Salida',
};

// Guest
export const GuestDictionary: { [key: string]: string } = {
  idguest: 'ID Invitado',
  firstname: 'Nombre',
  lastname: 'Apellido',
  type: 'Tipo',
  email: 'Email',
  phonenumber: 'Teléfono',
  note: 'Nota',
  documenttype: 'Tipo de Documento',
  documentnumber: 'Número de Documento',
  birthdate: 'Fecha de Nacimiento',
  acreditation: 'Acreditación',
};

// Location
export const LocationDictionary: { [key: string]: string } = {
  idlocation: 'ID Ubicación',
  fantasyname: 'Nombre de Fantasía',
  streetaddress: 'Dirección',
  number: 'Número',
  city: 'Ciudad',
  province: 'Provincia',
  country: 'País',
  postalcode: 'Código Postal',
  latitude: 'Latitud',
  longitude: 'Longitud',
};

// StatusSend
export const StatusSendDictionary: { [key: string]: string } = {
  sent: 'Enviado',
  visualized: 'Visualizada',
};

// Notification
export const NotificationDictionary: { [key: string]: string } = {
  idnotification: 'ID Notificación',
  recipient: 'Destinatario',
  idcontact: 'ID Contacto',
  subject: 'Asunto',
  idtemplate: 'ID Plantilla',
  templatename: 'Nombre de Plantilla',
  body: 'Cuerpo',
  datesend: 'Fecha de Envío',
  statussend: 'Estado de Envío',
  variables: 'Variables',
};

// PaymentStatus
export const PaymentStatusDictionary: { [key: string]: string } = {
  pending: 'Pendiente',
  completed: 'Completado',
  failed: 'Fallido',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

// Payment
export const PaymentDictionary: { [key: string]: string } = {
  idpayment: 'ID Pago',
  paymentdate: 'Fecha de Pago',
  idclient: 'ID Cliente',
  amount: 'Monto',
  detail: 'Detalle',
  status: 'Estado',
  reviewnote: 'Nota de Revisión',
};

// TimeSchedule
export const TimeScheduleDictionary: { [key: string]: string } = {
  idtimeschedule: 'ID Horario',
  title: 'Título',
  description: 'Descripción',
  idevent: 'ID Evento',
  scheduledtasks: 'Tareas Programadas',
};

// SupplierType
export const SupplierTypeDictionary: { [key: string]: string } = {
  catering: 'Catering',
  decoracion: 'Decoración',
  sound: 'Sonido',
  gastronomic: 'Gastronómico',
  furniture: 'Mobiliario',
  entertainment: 'Entretenimiento',
};

// Supplier
export const SupplierDictionary: { [key: string]: string } = {
  idsupplier: 'ID Proveedor',
  name: 'Nombre',
  cuit: 'CUIT',
  email: 'Email',
  phonenumber: 'Teléfono',
  aliascbu: 'Alias CBU',
  suppliertype: 'Tipo de Proveedor',
  address: 'Dirección',
};

// TaskStatus
export const TaskStatusDictionary: { [key: string]: string } = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

// Task
export const TaskDictionary: { [key: string]: string } = {
  idtask: 'ID Tarea',
  title: 'Título',
  description: 'Descripción',
  status: 'Estado',
  idevent: 'ID Evento',
};

// Role
export const RoleDictionary: { [key: string]: string } = {
  idrole: 'ID Rol',
  rolecode: 'Código de Rol',
  name: 'Nombre',
  description: 'Descripción',
};

// User
export const UserDictionary: { [key: string]: string } = {
  iduser: 'ID Usuario',
  firstname: 'Nombre',
  lastname: 'Apellido',
  birthdate: 'Fecha de Nacimiento',
  documenttype: 'Tipo de Documento',
  documentnumber: 'Número de Documento',
  email: 'Email',
  role: 'Rol',
};

// DictionaryMap
const DictionaryMap: { [key: string]: { [key: string]: string } } = {
  documenttype: DocumentTypeDictionary,
  client: ClientDictionary,
  employee: EmployeeDictionary,
  eventtype: EventTypeDictionary,
  eventstatus: EventStatusDictionary,
  event: EventDictionary,
  filetype: FileTypeDictionary,
  contenttype: ContentTypeDictionary,
  file: FileDictionary,
  guesttype: GuestTypeDictionary,
  guestaccesstype: GuestAccessTypeDictionary,
  guest: GuestDictionary,
  location: LocationDictionary,
  statussend: StatusSendDictionary,
  notification: NotificationDictionary,
  paymentstatus: PaymentStatusDictionary,
  payment: PaymentDictionary,
  timeschedule: TimeScheduleDictionary,
  suppliertype: SupplierTypeDictionary,
  supplier: SupplierDictionary,
  taskstatus: TaskStatusDictionary,
  task: TaskDictionary,
  role: RoleDictionary,
  user: UserDictionary,
};

// Lista de valores válidos para `type`
type DictionaryType =
  | 'documenttype'
  | 'client'
  | 'employee'
  | 'eventtype'
  | 'eventstatus'
  | 'event'
  | 'filetype'
  | 'contenttype'
  | 'file'
  | 'guesttype'
  | 'guestaccesstype'
  | 'guest'
  | 'location'
  | 'statussend'
  | 'notification'
  | 'paymentstatus'
  | 'payment'
  | 'timeschedule'
  | 'suppliertype'
  | 'supplier'
  | 'taskstatus'
  | 'task'
  | 'role'
  | 'user';

export function translate(text: string, type: DictionaryType): string {
  const dict = DictionaryMap[type.toLowerCase()];
  if (!dict) return text;

  return dict[text.toLowerCase()] || text;
}

export function translateWithGeneric(text: string): string {
  return GenericDictionary[text.toLowerCase()] || text;
}

// GENERIC DICTIONARY
export const GenericDictionary: { [key: string]: string } = {
  // DocumentType
  dni: 'DNI',
  passport: 'Pasaporte',
  cedula: 'Cédula',

  // Client
  idclient: 'ID Cliente',
  firstname: 'Nombre',
  lastname: 'Apellido',
  email: 'Email',
  phonenumber: 'Teléfono',
  documenttype: 'Tipo de Documento',
  documentnumber: 'Número de Documento',
  aliascbu: 'Alias CBU',
  events: 'Eventos',

  // Employee
  idemployee: 'ID Empleado',
  cuit: 'CUIT',
  birthdate: 'Fecha de Nacimiento',
  hiredate: 'Fecha de Contratación',
  position: 'Posición',
  creationdate: 'Fecha de Creación',
  updatedate: 'Fecha de Actualización',
  softdelete: 'Eliminado',

  // EventType
  corporate: 'Corporativo',
  social: 'Social',
  cultural: 'Cultural',
  entertainment: 'Entretenimiento',
  other: 'Otro',
  sports: 'Deportivo',

  // EventStatus
  confirmed: 'Confirmado',
  in_progress: 'En Progreso',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
  suspended: 'Suspendido',
  postponed: 'Pospuesto',

  // Event
  idevent: 'ID Evento',
  title: 'Título',
  description: 'Descripción',
  eventtype: 'Tipo de Evento',
  startdate: 'Fecha de Inicio',
  enddate: 'Fecha de Fin',
  status: 'Estado',
  client: 'Cliente',
  location: 'Ubicación',
  employeesids: 'IDs de Empleados',
  employees: 'Empleados',
  suppliersids: 'IDs de Proveedores',
  suppliers: 'Proveedores',
  guests: 'Invitados',
  tasks: 'Tareas',

  // FileType
  receipt: 'Recibo',
  billing: 'Facturación',
  payment: 'Pago',

  // ContentType
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/jpg': 'JPG',

  // File
  idfile: 'ID Archivo',
  filetype: 'Tipo de Archivo',
  filename: 'Nombre del Archivo',
  filecontenttype: 'Tipo de Contenido',
  fileurl: 'URL del Archivo',
  reviewnote: 'Nota de Revisión',
  supplierid: 'ID Proveedor',
  clientid: 'Cliente ID',
  employeeid: 'Empleado ID',

  // GuestType
  vip: 'VIP',
  regular: 'Regular',
  staff: 'Personal',
  family: 'Familia',
  friend: 'Amigo',
  general: 'General',

  // GuestAccessType
  entry: 'Entrada',
  exit: 'Salida',

  // Guest
  idguest: 'ID Invitado',
  type: 'Tipo',
  note: 'Nota',
  acreditation: 'Acreditación',

  // Location
  idlocation: 'ID Ubicación',
  fantasyname: 'Nombre de Fantasía',
  streetaddress: 'Dirección',
  number: 'Número',
  city: 'Ciudad',
  province: 'Provincia',
  country: 'País',
  postalcode: 'Código Postal',
  latitude: 'Latitud',
  longitude: 'Longitud',

  // StatusSend
  sent: 'Enviado',
  visualized: 'Visualizada',

  // Notification
  idnotification: 'ID Notificación',
  recipient: 'Destinatario',
  idcontact: 'ID Contacto',
  subject: 'Asunto',
  idtemplate: 'ID Plantilla',
  templatename: 'Nombre de Plantilla',
  body: 'Cuerpo',
  datesend: 'Fecha de Envío',
  statussend: 'Estado de Envío',
  variables: 'Variables',

  // PaymentStatus
  completed: 'Completado',
  refunded: 'Reembolsado',

  // Payment
  idpayment: 'ID Pago',
  paymentdate: 'Fecha de Pago',
  amount: 'Monto',
  detail: 'Detalle',

  // TimeSchedule
  idtimeschedule: 'ID Horario',
  scheduledtasks: 'Tareas Programadas',

  // SupplierType
  catering: 'Catering',
  decoracion: 'Decoración',
  sound: 'Sonido',
  gastronomic: 'Gastronómico',
  furniture: 'Mobiliario',

  // Supplier
  idsupplier: 'Proveedor ID',

  // TaskStatus
  //"in_progress": "En Progreso (Tarea)",
  //"completed": "Completado (Tarea)",
  //"cancelled": "Cancelado (Tarea)",
  pending: 'Pendiente',

  // Task
  idtask: 'ID Tarea',

  // Role
  idrole: 'ID Rol',
  rolecode: 'Código de Rol',

  // User
  iduser: 'ID Usuario',
  role: 'Rol',
};
