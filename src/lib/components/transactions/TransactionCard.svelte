<script>
  import { formatPHP } from '../../../utils/money.js';
  import TreatmentSelect from './TreatmentSelect.svelte';

  const TREATMENT_LABELS = { normal: 'Normal', big_purchase: 'Big Purchase', monthly: 'Monthly 50/50' };

  let { tx, onupdate } = $props();
  let treatment = $state('normal');
  let note = $state('');

  $effect(() => {
    tx.messageid;
    treatment = tx.budget_treatment || 'normal';
    note = tx.budget_treatment_note || '';
  });

  function save() {
    onupdate?.({ messageid: tx.messageid, budget_treatment: treatment, budget_treatment_note: note });
  }
</script>

<article class="tx-card">
  <details>
    <summary class="tx-top">
      <span class="tx-id">
        <strong>{tx.vendor}</strong>
        <span class="tx-badge tx-badge--{treatment}">{TREATMENT_LABELS[treatment] || 'Normal'}</span>
      </span>
      <span class="tx-amount">{formatPHP(tx.amount || 0)}</span>
    </summary>
    <div class="tx-meta">{tx.messagedate} · {tx.category} · {tx.valid ? 'Valid' : 'Invalid'}</div>
    {#if tx.description}<p>{tx.description}</p>{/if}
    <TreatmentSelect bind:treatment bind:note onchange={save} />
  </details>
</article>