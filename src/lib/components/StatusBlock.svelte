<script>
  let { type = 'info', message } = $props();
</script>

<div class="status {type}">{message}</div>
