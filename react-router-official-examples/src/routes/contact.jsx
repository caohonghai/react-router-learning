import { useFetcher } from "react-router-dom";
import { Form, useLoaderData } from "react-router-dom";
import { getContact, updateContact } from "../contact";

export const loader = async ({ params }) => {
    const contact = await getContact(params.contactId);
    if (!contact) {
        throw new Response('', {
            status: 404,
            statusText: 'Not Found'
        })
    }
    return contact;
}

export const action = async ({ request, params }) => {
    let formData = await request.formData();
    return updateContact(params.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}

export default function Contact() {
    const contact = useLoaderData();

    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={contact.avatar || null}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        {/* 当用户点击删除时
                            1. react router 会阻止浏览器自身到服务器的 POST 请求。
                            2. 创建一个具有客户端路由的POST请求来模拟浏览器。
                            3. 匹配 Form 的 action 属性的路由 `/contacts/:contactId/destroy`
                            4. 重定向之后 react router 调用所有数据的 loader 获取最新值
                            5. 使用 useLoaderData 返回新的值，使得组件更新
                        */}
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

const Favorite = ({ contact }) => {
    // yes, this is a `let` for later
    let favorite = contact.favorite;
    // useFetcher 允许我们在使用 loaders 或者 actions 的时候不进行导航。
    const fetcher = useFetcher();
    if (fetcher.formData) {
        favorite = fetcher.formData.get('favorite') === 'true';
    }
    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}