export interface BannerLink {
  id: number;
  documentNumber: string;
}

export interface BannerImageWithFileUrl extends BannerImage {
  fileUrl: string;
}

export interface BannerImage {
  fileName: string;
  contentType: string;
  fileSize: number;
  // fileContent: Uint8Array;
}

export interface Banner {
  id: number;
  createdDate: Date;
  initialDate: Date;
  finalDate?: Date;
  exclusionDate?: Date;
  excluded: boolean;
  exclusionUser: string;
  portalImage: BannerImageWithFileUrl | null;
  appImage: BannerImageWithFileUrl | null;
  backgroundColor: string;
  url: string;
}

export interface MessageLink {
  id: number;
  documentNumber: string;
  read: boolean;
  readDescription: string;
  readDate: Date;
  displayed: boolean;
  displayedDate: Date;
  excluded: boolean;
  exclusionDate: Date;
}

export interface Message {
  id: number;
  title: string;
  text: string;
  read: boolean;
  displayed: boolean;
  createdDate: string;
  excludionDate: string;
  status: number;
  statusDescricao: string;
  links: MessageLink[];
  listLinkedCnpjs: string[];
  pushNotification: boolean;
  allEstablishments: boolean;
}

export interface Notification {
  id: number;
  title: string;
  text: string;
  read: boolean;
  displayed: boolean;
  createdDate: string;
  documentNumber: string;
}

export interface PushNotificationsSettings {
  enabled: boolean;
  subscription: PushSubscription | null;
}
