<script>
  let { title, subtitle = '', children } = $props();
</script>

<header class="page-head">
  <div>
    <h1>{title}</h1>
    {#if subtitle}<p>{subtitle}</p>{/if}
  </div>
  {#if children}<div class="head-actions">{@render children()}</div>{/if}
</header>
