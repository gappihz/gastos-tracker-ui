<script>
  import TreatmentSelect from './TreatmentSelect.svelte';
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

<TreatmentSelect bind:treatment bind:note onchange={save} />
