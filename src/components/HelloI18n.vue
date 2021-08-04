<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'HelloI18n',
};
</script>

<i18n>
{
  "en": {
    "hello": "This is a test Component"
  }
}
</i18n>
