<script>
  import { formatPHP } from '../../../utils/money.js';
  import TreatmentCell from './TreatmentCell.svelte';

  let { transactions = [], onupdate } = $props();
</script>

<div class="desktop-table">
  <table>
    <thead><tr><th>Date</th><th>Vendor</th><th>Category</th><th>Amount</th><th>Valid</th><th>Description</th><th>Treatment</th></tr></thead>
    <tbody>
      {#each transactions as tx (tx.messageid)}
        <tr>
          <td>{tx.messagedate}</td>
          <td>{tx.vendor}</td>
          <td>{tx.category}</td>
          <td>{formatPHP(tx.amount || 0)}</td>
          <td>{tx.valid ? 'Yes' : 'No'}</td>
          <td>{tx.description}</td>
          <td><TreatmentCell {tx} {onupdate} /></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
