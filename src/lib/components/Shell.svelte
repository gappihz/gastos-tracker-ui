<script>
  let { route, setRoute, children } = $props();
  const nav = [
    { id: 'budget', label: 'Budget', short: 'Budget' },
    { id: 'projection', label: 'Projection', short: 'Plan' },
    { id: 'subscriptions', label: 'Subscriptions', short: 'Subs' },
    { id: 'settings', label: 'Settings', short: 'Set' }
  ];
</script>

<div class="app-shell">
  <aside class="desktop-rail">
    <div class="brand">Gastos</div>
    {#each nav as item}
      <button class:active={route === item.id} onclick={() => setRoute(item.id)}>{item.label}</button>
    {/each}
  </aside>

  <main class="content">
    {@render children()}
  </main>

  <nav class="bottom-nav" aria-label="Primary navigation">
    {#each nav as item}
      <button class:active={route === item.id} onclick={() => setRoute(item.id)}>{item.short}</button>
    {/each}
  </nav>
</div>
