import {
    Form,
    useLoaderData,
    redirect,
    Link,
    useNavigate
} from "react-router-dom";
import { updateContact } from "../contact";

// react router 会阻止发送请求，从而使用这里的action进行代替。
export const action = async ({ request, params }) => {
    const formData = await request.formData();
    // 可以通过 name 拿到字段值
    console.log(formData.get('first'), formData.get('last'));
    const updates = Object.fromEntries(formData);
    console.log(updates);
    await updateContact(params.contactId, updates);
    // loader 和 action 都可以返回一个响应
    return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
    const contact = useLoaderData();
    const navigate = useNavigate();

    return (
        <Form method="post" id="contact-form">
            <p>
                <span>Name</span>
                <input
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                    name="first"
                    defaultValue={contact.first}
                />
                <input
                    placeholder="Last"
                    aria-label="Last name"
                    type="text"
                    name="last"
                    defaultValue={contact.last}
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    type="text"
                    name="twitter"
                    placeholder="@jack"
                    defaultValue={contact.twitter}
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Avatar URL"
                    type="text"
                    name="avatar"
                    defaultValue={contact.avatar}
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea
                    name="notes"
                    defaultValue={contact.notes}
                    rows={6}
                />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button" onClick={() => { navigate(-1) }}>Cancel</button>
            </p>
        </Form>
    );
}