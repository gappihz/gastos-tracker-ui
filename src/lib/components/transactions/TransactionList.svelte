<script>
  import TransactionCard from './TransactionCard.svelte';
  import TransactionTable from './TransactionTable.svelte';
  let { transactions = [], onupdate } = $props();
  let isMobile = $state(false);

  $effect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    isMobile = mq.matches;
    const handler = (e) => (isMobile = e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });
</script>

{#if !transactions.length}
  <div class="status">No transactions found for this period.</div>
{:else if isMobile}
  <section class="tx-list">
    {#each transactions as tx (tx.messageid)}
      <TransactionCard {tx} {onupdate} />
    {/each}
  </section>
{:else}
  <TransactionTable {transactions} {onupdate} />
{/if}