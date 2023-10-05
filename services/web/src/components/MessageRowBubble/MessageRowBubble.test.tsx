import MessageRow from "./MessageRowBubble";
import { render, screen } from "@testing-library/react";
import { ChatContext } from "@judie/hooks/useChat";
import { Chat, Message, MessageType } from "@judie/data/types/api";

const customRender = (ui: any, { providerProps, ...renderOptions }: any) => {
  return render(
    <ChatContext.Provider {...providerProps}>{ui}</ChatContext.Provider>,
    renderOptions
  );
};

const TestChat: Chat = {
  id: "1",
  userId: "1",
  subject: "Test Subject",
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const TestMessage: Message = {
  id: "1",
  chatId: "1",
  type: MessageType.USER,
  content: "Content of Message",
  readableContent: "Readable Content of Message",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ChatNavbar Component: ", () => {
  it("should render", () => {
    render(<MessageRow message={TestMessage} beingStreamed={false} />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  // test("ChatNavbar shows default value", () => {
  //   render(<ChatNavbar />);
  //   expect(screen.getByText(/^No Sub/)).toHaveTextContent("No Subject");
  // });

  // test("ChatNavbar shows value from provider", () => {
  //   const providerProps = {
  //     value: {
  //       chat: TestChat,
  //     },
  //   };

  //   customRender(<ChatNavbar />, { providerProps });
  //   expect(screen.getByText(/^Test S/)).toHaveTextContent("Test Subject");
  // });
});
