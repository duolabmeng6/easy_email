import {MetaFunction, type LoaderFunction} from "@remix-run/node";
import {Link, useLoaderData, useRouteError} from "@remix-run/react";
import {format} from "date-fns/format";
import {ArrowUturnLeft, UserCircleIcon} from "icons";
import {useTranslation} from "react-i18next";

export const meta: MetaFunction = () => {
    return [
        {title: "Detail"},
        {
            name: "description",
            content:
                "Virtual temporary Email. Privacy friendly, Valid for 1 day, AD friendly, 100% Run on Cloudflare",
        },
    ];
};

export const loader: LoaderFunction = async ({params}) => {
    const id = params.id;

    if (!id) {
        throw new Error("No mail id provided");
    }
    //发起http请求
    const response = await fetch(
        process.env.QUERY_WORKER_URL + `/get?id=${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const mail = await response.json();
    return {
        id: mail.id,
        subject: mail.subject,
        from: {address: mail.mfrom, name: mail.mfrom},
        date: new Date(mail.createdAt).toISOString(),
        html: mail.html,
        text: mail.body,
    };
};

export default function MailViewer() {
    const {t} = useTranslation();

    const mail = useLoaderData<typeof loader>();
    return (
        <div className="mt-24 mx-6 md:mx-10 flex flex-1 flex-col p-2 gap-10">
            <Link
                to="/"
                className="flex text-white w-fit font-semibold items-center border p-2 rounded-md gap-2">
                <ArrowUturnLeft/>
                {t("Back Home")}
            </Link>
            <div className="flex items-start text-white">
                <div className="flex items-start gap-4 text-sm">
                    <div>
                        <UserCircleIcon/>
                    </div>
                    <div className="grid gap-1">
                        <div className="font-semibold">{mail.from.name}</div>
                        <div className="line-clamp-1 text-xs">{mail.subject}</div>
                        <div className="line-clamp-1 text-xs">
                            <span className="font-medium">Reply-To:</span> {mail.from.address}
                        </div>
                    </div>
                </div>
                {mail.date && (
                    <div className="ml-auto text-xs text-muted-foreground">
                        {format(new Date(mail.date), "PPpp")}
                    </div>
                )}
            </div>
            <div className="flex-1 flex text-sm bg-[#ffffffd6] backdrop-blur-xl rounded-md p-3 min-h-0 overflow-y-auto">
                <article
                    className="prose"
                    dangerouslySetInnerHTML={{__html: mail.html || mail.text || ""}}
                />
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError() as Error;
    return (
        <div className="flex flex-1 flex-col gap-10">
            <Link
                to="/"
                className="flex w-fit font-semibold items-center border p-2 rounded-md gap-2">
                <ArrowUturnLeft/>
                Back Home
            </Link>

            <div className="flex items-center justify-center font-semibold text-xl text-red-500">
                {error.message}
            </div>
        </div>
    );
}
