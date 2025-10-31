<script context="module">
    export async function preload({ params }, { token }) {
        if (!token) {
            this.redirect(302, '/login');
        }
    }
</script>

<script>
    import { post } from 'utils.js';

    async function getMyData() {
        return await post(`auth/getMyData`).then(r => {
            if (r && r.accounts) {
                r.funds = r.accounts.reduce((funds, account) => funds + account.balance, 0);
            }
            return r;
        });
    }

    async function getTransactions() {
        return await post(`auth/getTransactions`);
    }
</script>

{#if process.browser}
    {#await getMyData()}
        loading...
    {:then my}
    <section>
        <p style="font-size: xx-large">
            {my.name}
            <br>
            <small>
                (id: {my.id}, firstName: {my.firstName}, lastName: {my.lastName}, 
                email: {my.email}, permissionLevel: {my.permissionLevel})
            </small>
        </p>
    </section>

    <section>
        My funds
        <p style="font-size: xx-large; color:{my.funds > 0 ? 'green' : 'red'}">{my.funds}</p>
    </section>

    <section>
        <ul>
            {#each my.accounts as account}
                <li>{account.number} ({account.name})</li>
            {/each}
        </ul>
    </section>

    <section>
        {#await getTransactions()}
            loading...

        {:then transactions}
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>SenderName</th>
                        <th>Amount</th>
                        <th>CreatedAt</th>
                        <th>Status</th>
                        <th>StatusDetail</th>
                        <th>loggedInUser</th>
                    </tr>
                </thead>
                <tbody>  
                    {#each transactions as transaction}
                        <tr>
                            <td><b>{@html transaction.senderName.replace(/a/gi, '<span style="color: purple;">$&</span>')}</b></td>
                            <td style="color: {transaction.amount > 200 ? 'blue' : transaction.amount > 0 ? 'green' : 'red'}">
                                {transaction.amount} {transaction.currency}
                            </td>
                            <td>{transaction.createdAt}</td>
                            <td><b>{transaction.status}</b></td>
                            <td>{transaction.statusDetail || '—'}</td>
                            <td>{transaction.loggedInUser || my.email}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/await}
    </section>
    {/await}
{/if}