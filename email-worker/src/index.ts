import {ForwardableEmailMessage} from '@cloudflare/workers-types';
import {nanoid} from 'nanoid/non-secure';
import PostalMime from 'postal-mime';

export interface Env {
	DB: D1Database;
}

export default {
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
		try {
			// 提取邮件的发送者和接收者信息
			const messageFrom = message.from;
			const messageTo = message.to;

			// 将原始邮件内容转换为文本格式并解析
			const rawText = await new Response(message.raw).text();
			const mail = await new PostalMime().parse(rawText);
			const allJson = {...mail}
			// 删除allJson的allJson.headers属性
			delete allJson.headers;

			// 准备插入数据库的邮件信息
			const id = nanoid(); // 生成唯一的 ID
			const subject = mail.subject || ""; // 邮件主题
			const body = mail.text || ""; // 邮件的文本内容
			const html = mail.html || ""; // 邮件的 HTML 内容
			const createdAt = Date.now(); // 当前时间戳

			// 执行插入操作，将解析后的数据插入数据库
			const {success, error} = await env.DB.prepare(
				"INSERT INTO email (id, mfrom, mto, subject, body, html, allJson, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
			)
				.bind(id, messageFrom, messageTo, subject, body, html, JSON.stringify(allJson), createdAt)
				.run();

			// 错误处理
			if (!success) {
				console.log(`Error inserting data: ${error}`);
			}
		} catch (e) {
			console.log(`Exception caught: ${e}`);
		}
	},
};
