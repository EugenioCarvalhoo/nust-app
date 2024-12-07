<script lang="ts" setup>
  const { isAdmins } = useDataStore()

  const url = isAdmins ? '/app/dashboard' : '/app/receita'
  navigateTo(url)
</script>