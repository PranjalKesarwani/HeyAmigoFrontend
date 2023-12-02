
export type TUser = {
  _id: string;
  username: string;
  pic: string;
  email: string;

}

export type TMessage = {
  _id: string,
  senderId: TUser,
  chatId:string
  message: string,
  messageType: string,
  createdAt:string
}

export type TSearchedData = {
  _id: string,
  username: string,
  email: string
}

export type TPContactUser =  {
  personInfo: {
    _id: string,
    username: string,
    email: string,
    pic: string
  },
  messageCount: number,
  _id: string
}

export type TPContact = {
  _id:string;
  chatName:string;
  isGroupChat:boolean;
  users:TPContactUser[],
  latestMessage: TMessage | null,
}

export type TPMessage = 
  {
    _id:string,
    senderId:TUser,
    message:string,
    messageType:string,
    chatId:string,
    createdAt:string
  }

  export type TGrpMessage = {
    senderId: TUser;
    message: string;
    messageType: string;
    chatId: string;
    createdAt: string;
    updatedAt: string;
}

export type TGContactUser =  {
  personInfo: {
    _id: string,
    username: string,
    email: string,
    pic: string
  },
  messageCount: number,
  _id: string
}

export type TDashGContact = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  groupAdmin: TUser,
  users: TGContactUser[],
  latestMessage: TGrpMessage | null,
  createdAt: string;
}

export type TImgWindow = {
  name: string;
  type: string;
  size: string;
}





