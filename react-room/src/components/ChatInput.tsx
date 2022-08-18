import React from 'react'
import styled from "styled-components";
import SendRoundedIcon from '@material-ui/icons/SendRounded';

const Button = styled.button`
    position: absolute;
    z-index: 100;
    background-color: #627DFF;
    border: none;
    border-radius: 50px;
    color: white;
    font-size: 17px;
    right: 3%;
    top: 16%;
    padding: 2%;
    display: flex;
    width: 40px !important;
`;

const Form = styled.form`
    width: 400px;
    position: relative;

`;
const TextArea = styled.textarea`
    width: 98%;
    height: 100px;
    border-radius: 10px;
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 54px;
    padding-top: 10px;
    font-size: 17px;
    background-color: white;
    border: 1px solid lightgray;
    outline: none;
    color: #0f3057;
    letter-spacing: 1px;
    line-height: 20px;
    ::placeholder {
        color: #9e9e9e;
    }
`;



function ChatInput({ setMessage, sendMessage, message }: any) {

    return (
        <>
            <Form>
                <TextArea className="input"
                    placeholder="Type a message..."
                    value={message}
                    onChange={({ target: { value } }) => setMessage(value)}
                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null} />
                <Button onClick={e => sendMessage(e)}><SendRoundedIcon /></Button>
            </Form>
        </>
    )
}

export default ChatInput
