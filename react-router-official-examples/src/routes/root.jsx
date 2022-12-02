import * as React from 'react';
import { useState } from 'react';
import { redirect } from "react-router-dom";
import { useNavigation } from "react-router-dom";
import { Outlet, NavLink, useLoaderData, Form, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contact";

export const loader = async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const contacts = await getContacts(q);
    // 这里的数据 可以使用 useLoaderData 这个 Hook 获取
    return { contacts, q };
}
export const action = async () => {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}
const Root = () => {
    const { contacts, q } = useLoaderData();
    const [query, setQuery] = useState(q);
    // 当 q 更新时候 重新给 搜索框赋值
    React.useEffect(() => {
        setQuery(q);
    }, [q]);
    // useNavigation 会返回当前导航的状态 idle | submitting | loading
    const navigation = useNavigation();
    // 获取 DOM
    const submit = useSubmit();
    const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            value={query || ''}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                const isFirstSearch = q == null;
                                submit(e.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div
                id="detail"
                className={navigation.state === "loading" ? "loading" : ""}
            >
                <Outlet />
            </div>
        </>
    );
}
export default Root;

