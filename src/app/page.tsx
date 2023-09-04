"use client";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";

const imageUrl =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

interface Message {
  username: string;
  message: string;
}

export default function Home() {
  const [username, setUserName] = useState("username");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  let allMessages: Message[] = [];

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("bb3f3ebe900a078744c1", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data: any) {
      allMessages.push(data);
      setMessages(allMessages);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/v1/messages/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, message }),
    });

    setMessage("");
  };

  return (
    <>
      <div className="sm:col-span-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6 text-slate-100"
        >
          Username
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="username"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-100 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="janesmith"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="divide-y divide-slate-700"
        style={{ minHeight: 500 }}
      >
        {messages.map((message, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={imageUrl}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-slate-100">
                  {message.username}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-slate-100">
                  {message.message}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-slate-100">Online</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={submit}>
        <div className="md:col-span-4">
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-100 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Write a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
