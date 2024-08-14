import {LoaderFunction} from "@remix-run/node";
import {userMailboxCookie} from "../cookies.server";

export const loader: LoaderFunction = async ({request}) => {
    const userMailbox =
        ((await userMailboxCookie.parse(
            request.headers.get("Cookie"),
        )) as string) || undefined;
    if (!userMailbox) {
        return [];
    }
    console.log("userMailbox", userMailbox)

    const response = await fetch(
        process.env.QUERY_WORKER_URL + `/list?recipient=${userMailbox}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    // 读取 response 的 数据
    const mails = await response.json();
    return mails;
};
