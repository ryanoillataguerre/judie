import { UIMessageType } from "@judie/hooks/useChat"

const MessageRow = ({ message}: { 
    message: UIMessageType
}) => {
    return (
        <div>
            {message.readableContent}
        </div>
    )
}
export default MessageRow