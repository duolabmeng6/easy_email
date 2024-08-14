export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request, env): Promise<Response> {
		const {pathname, searchParams} = new URL(request.url);

		// 根据收件人的邮箱查询邮件列表
		if (pathname === "/api/email/list") {
			const recipient = searchParams.get("recipient");

			if (!recipient) {
				return new Response("Missing 'recipient' query parameter", {status: 400});
			}

			let {results} = await env.DB.prepare(
				"SELECT * FROM email WHERE mto = ? ORDER BY createdAt DESC"
			)
				.bind(recipient)
				.all();
			// 循环结果 把 allJson 转换为对象合并回去 删除 allJson
			results = results.map((item: any) => {
				item = {
					...item,
					...JSON.parse(item.allJson),
				};
				delete item.allJson;
				return item;
			});

			return Response.json(results);
		}

		// 根据邮件ID查询邮件内容
		if (pathname === "/api/email/get") {
			const emailId = searchParams.get("id");

			if (!emailId) {
				return new Response("Missing 'id' query parameter", {status: 400});
			}

			const {results} = await env.DB.prepare(
				"SELECT * FROM email WHERE id = ?"
			)
				.bind(emailId)
				.all(); // `first()` is used to fetch a single record

			if (!results) {
				return new Response("Email not found", {status: 404});
			}
			let result = results[0]
			result = {
				...result,
				...JSON.parse(result.allJson),
			};
			return Response.json(result);
		}

		// 如果路径不匹配，返回404
		return new Response("email API", {status: 404});
	},
} satisfies ExportedHandler<Env>;
