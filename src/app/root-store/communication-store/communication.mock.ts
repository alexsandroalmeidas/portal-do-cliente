import { Banner, Message, Notification } from './communication.models';

export const mockBanners: Banner[] = [
  {
    id: 1,
    createdDate: new Date(),
    initialDate: new Date(),
    finalDate: new Date(),
    exclusionDate: undefined,
    excluded: false,
    exclusionUser: '',
    backgroundColor: '#4E2096',
    url: 'https://google.com',
    portalImage: {
      fileName: 'banner1.png',
      contentType: 'image/png',
      fileSize: 12345,
      fileUrl: 'https://via.placeholder.com/300x100',
    },
    appImage: null,
  },
];

export const mockMessages: Message[] = [
  {
    id: 1,
    title: 'Mensagem teste',
    text: 'Conteúdo da mensagem',
    read: false,
    displayed: true,
    createdDate: new Date().toISOString(),
    excludionDate: '',
    status: 1,
    statusDescricao: 'Ativo',
    links: [],
    listLinkedCnpjs: ['12345678000100'],
    pushNotification: true,
    allEstablishments: true,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Notificação',
    text: 'Você tem uma nova notificação',
    read: false,
    displayed: false,
    createdDate: new Date().toISOString(),
    documentNumber: '12345678000100',
  },
];
