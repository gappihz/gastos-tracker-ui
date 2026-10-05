<script>
  import Shell from './lib/components/Shell.svelte';
  import BudgetPage from './lib/pages/BudgetPage.svelte';
  import ProjectionPage from './lib/pages/ProjectionPage.svelte';
  import SubscriptionsPage from './lib/pages/SubscriptionsPage.svelte';
  import SettingsPage from './lib/pages/SettingsPage.svelte';

  let route = $state(location.hash.replace('#', '') || 'budget');

  function setRoute(next) {
    route = next;
    history.replaceState(null, '', `#${next}`);
  }

  window.addEventListener('hashchange', () => {
    route = location.hash.replace('#', '') || 'budget';
  });
</script>

<Shell {route} {setRoute}>
  {#if route === 'budget'}
    <BudgetPage />
  {:else if route === 'projection'}
    <ProjectionPage />
  {:else if route === 'subscriptions'}
    <SubscriptionsPage />
  {:else if route === 'settings'}
    <SettingsPage />
  {:else}
    <BudgetPage />
  {/if}
</Shell>
