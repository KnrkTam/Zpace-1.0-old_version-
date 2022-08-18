import Knex from "knex";

class ChatRoomService {
    constructor(private knex: Knex) { }
    getChatData = async (userId: any) => {
        let requestSLot = await this.knex("customer_booking_time_slot").select(["customer_id", "customer_booking_time_slot.id", "customer_booking_time_slot.rooms_id"]).innerJoin("rooms", "rooms_id", "rooms.id").where("room_owner_id", userId).andWhere("status", "pending")

        let chatLog = await this.knex("message").select(["chat_table.id", "sender_id", "is_read"]).where("host_id", userId).orWhere("customer_id", userId).innerJoin("chat_table", "chat_table_id", "chat_table.id").distinct()
        return { requestSLot, chatLog }
    }

    initChatData = async (customer_id: any, initChatInput: any, host_id: any, space_name: any) => {
        let customerInfo = await this.knex.select(["username", "email"]).from("account").where("id", customer_id).first()
        let hostInfo = await this.knex.select(["username", "email"]).from("account").where("id", host_id).first()
        let joinMessage = `Enquiry On Room: ${space_name} -- ${initChatInput}`
        let checkIfChatExist = await this.knex.select("*").from("chat_table").where("host_id", host_id).andWhere("customer_id", customer_id)
        let id:any
        if (checkIfChatExist.length === 0) {
            id = await this.knex.insert({ customer_id: customer_id, host_id: host_id }).into("chat_table").returning("id")
            await this.knex.insert({ sender_id: customer_id, content: joinMessage, is_read: false, chat_table_id: id[0], is_request: false }).into("message")
            id = id[0]
        } else {
            await this.knex.insert({ sender_id: customer_id, content: joinMessage, is_read: false, chat_table_id: checkIfChatExist[0].id, is_request: false }).into("message")
            id = checkIfChatExist[0].id
        }
        return { hostInfo, customerInfo, chat_table_id:  id}
    }
    requestPreview = async (customer_id: any, rooms_id: any) => {
        let roomPreview = await this.knex.select("space_name").from("rooms").where("id", rooms_id)
        let roomPicPreview = await this.knex.select("picture_filename").from("room_pictures").where("rooms_id", rooms_id).first()
        let customerPreview = await this.knex.select(["username", "profile_picture"]).from("account").where("id", customer_id)
        return { roomPreview, roomPicPreview, customerPreview }
    }
    requestChatPreview = async (chat_id: any, user_id: any) => {
        let oppositeSideID
        let chatPreview = await this.knex.select("*").from("chat_table").where("id", chat_id).first()
        if (chatPreview.customer_id === user_id) {
            oppositeSideID = chatPreview.host_id
        } else {
            oppositeSideID = chatPreview.customer_id
        }
        let customerPreview = await this.knex.select(["username", "profile_picture"]).from("account").where("id", oppositeSideID)
        return customerPreview
    }
    fetchChatContent = async (chat_id: any) => {
        let chatTable = await this.knex.select("*").from("chat_table").where("id", chat_id).first()
        let HostPreview = await this.knex.select(["username", "profile_picture"]).from("account").where("id", chatTable.host_id)
        let customerPreview = await this.knex.select(["username", "profile_picture"]).from("account").where("id", chatTable.customer_id)
        let chatContent = await this.knex.select("*").from("message").where("chat_table_id", chat_id).orderBy("created_at", "ASC")
        return { chatTable, HostPreview, customerPreview, chatContent }
    }
    updateChatContent = async (messageLog: {
        content: string
        sender_id: number
        chat_table_id: number
        is_request: boolean
        is_read: boolean
    }) => {
        await this.knex.insert(messageLog).into("message")
    //    let ids = await this.knex.select(["customer_id", "host_id"]).from("chat_table").where("id", messageLog.chat_table_id)

    }
    updateChatRead = async (chatDate: any, msg: any, userId: any) => {
        if (userId !== msg.sender_id) {
            await this.knex("message").update({ is_read: true }).where("sender_id", msg.sender_id).andWhere("chat_table_id", chatDate.id)

        }
    }
    updateMsgRead = async (userId: any, chatTable: any) => {
        if (userId === chatTable.host_id) {
            await this.knex("message").update({ is_read: true }).where("sender_id", chatTable.customer_id).andWhere("chat_table_id", chatTable.id)
        } else {
            await this.knex("message").update({ is_read: true }).where("sender_id", chatTable.host_id).andWhere("chat_table_id", chatTable.id)
        }
    }
}


export default ChatRoomService;