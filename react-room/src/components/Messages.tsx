import React, { useEffect, useRef } from 'react'
import styled from "styled-components";
import { useInView } from 'react-intersection-observer';
import styles from "../css/Messages.module.css";
import moment from 'moment';

const MyRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 500px;
    max-height: 500px;
    overflow: auto;
    width: 400px;
    border: 1px solid lightgray;
    border-radius: 10px;
    padding-bottom: 10px;
    margin-top: 25px;
    background-color: #F3F5FC;
    height: "fit-content";
    -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
`;

const MyMessage = styled.div`
    width: 45%;
    background-color: #60f490;
    color: #0f3057;
    padding: 10px;
    margin-right: 5px;
    border-radius: 15px;
    word-wrap: break-word;
    -webkit-border-radius: 5px;
    -webkit-box-shadow: 0px 0px 8px #B2B2B2;
    text-align: left;
    display: flex;
    flex-direction: column;
    width: fit-content;
    max-width: 70%;
    -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

`;

const PartnerRow = styled(MyRow)`
    justify-content: flex-start;
`;

const PartnerMessage = styled.div`
    background-color: white;
    color: #0f3057;
    border: 1px solid lightgray;
    padding: 10px;
    margin-left: 5px;
    border-radius: 15px;
    word-wrap: break-word;
    -webkit-border-radius: 5px;
    -webkit-box-shadow: 0px 0px 6px #B2B2B2;
    display: flex;
    flex-direction: column;
    width: fit-content;
    text-align: left;
    max-width: 70%;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;`
// let messageLog = {
//     content: message,
//     sender_id: user_id,
//     chat_table_id: chatDate.id,
//     is_request: false,
//     is_read: false
// }
function Messages({ messages, userId }: any) {
    const {
        ref, inView,
        // entry 
    } = useInView({
        /* Optional options */
        threshold: 0,
    });
    const messagesEndRef = useRef<any>(null)
    const scrollToBottom = () => {
        if (inView) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(scrollToBottom, [messages]);

    return (
        <Container >
            {messages.map((e: any, index: number)=>{
                if (!e.is_request) {
                    if (e.sender_id === userId) {
                        return (
                            <MyRow key={index}>
                                <MyMessage>
                                    <div style={{ width: "100%", height: "fit-content" }}>{e.content}</div>
                                    <div className={styles.time_show}>{moment(new Date(e.created_at || new Date())).calendar()}</div>
                                </MyMessage>

                            </MyRow>
                        )
                    }
                    return (
                        <PartnerRow key={index}>
                            <PartnerMessage>
                                <div style={{ width: "100%", height: "fit-content"  }}>{e.content}</div>
                                <div className={styles.time_show}>{moment(new Date(e.created_at || new Date())).calendar()}</div>
                            </PartnerMessage>

                        </PartnerRow>
                    )
                }
                return null
            })}
            <div ref={messagesEndRef} />
            <div ref={ref} />
        </Container>
    )
}

export default Messages
