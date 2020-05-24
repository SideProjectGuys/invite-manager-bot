# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [9.8.0](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.7.0...v9.8.0) (2020-05-24)

### Features

- **docs:** Update documentation ([00e99b9](https://github.com/SideProjectGuys/invite-manager-bot/commit/00e99b92a8f32c1d0f7f719ef8ed512f617bda17))
- **i18n:** Update translations ([a117749](https://github.com/SideProjectGuys/invite-manager-bot/commit/a1177497a2c5e35e7504a7f932e05636f9b04637))
- **invites:** Handle invite gateaway events ([dd3d2a2](https://github.com/SideProjectGuys/invite-manager-bot/commit/dd3d2a21141c390d2a4153bcfec6f12e623a63b0))
- **package:** Update dependencies ([3addde5](https://github.com/SideProjectGuys/invite-manager-bot/commit/3addde529003e20d9a2299e77d23a81b67494f56))

### Bug Fixes

- **credits:** Update credits.ts with latest info. ([#138](https://github.com/SideProjectGuys/invite-manager-bot/issues/138)) ([e846b26](https://github.com/SideProjectGuys/invite-manager-bot/commit/e846b26ce55d25ce878a9823b22b6e23ab59f585))
- **scheduler:** Fix scheduled functions bug ([7698091](https://github.com/SideProjectGuys/invite-manager-bot/commit/7698091ecbee49255391d1e2e77e222ca4db8be6))

## [9.7.0](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.6.2...v9.7.0) (2020-03-31)

### Features

- **tracking:** Change startup to match cpus ([5420487](https://github.com/SideProjectGuys/invite-manager-bot/commit/54204870e20c2538aa279a4dd892a47e51bf34ca))
- **vanity:** Only request vanity url when needed ([b5a7dff](https://github.com/SideProjectGuys/invite-manager-bot/commit/b5a7dff60362d3722a133c70316c5e8c95308a90))

### [9.6.2](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.6.1...v9.6.2) (2020-03-30)

### Bug Fixes

- **startup:** Revert large sharding ([43f5ad9](https://github.com/SideProjectGuys/invite-manager-bot/commit/43f5ad9eddc44f4ba6052b999c27b0a630531846))

### [9.6.1](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.6.0...v9.6.1) (2020-03-30)

### Bug Fixes

- **client:** Fix pinging roles and users ([5475e2b](https://github.com/SideProjectGuys/invite-manager-bot/commit/5475e2be4bbc846867df68d25e7b3b67feb4594d))
- **requests:** Group user requests properly ([0942390](https://github.com/SideProjectGuys/invite-manager-bot/commit/09423903d02626a96f109a60be52fb02447b1ec5))
- **startup:** Respect large bot sharding ([07d3418](https://github.com/SideProjectGuys/invite-manager-bot/commit/07d34189bf613fc84e8c37e4fb66f8661d6c8c5f))

## [9.6.0](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.5.0...v9.6.0) (2020-03-30)

### Features

- **vanity:** Cache urls to reduce requests ([55d0560](https://github.com/SideProjectGuys/invite-manager-bot/commit/55d05607632f523534e4eff9cafafcbb3f83acdb))

### Bug Fixes

- **metrics:** Fix remove user reaction requets ([88b99fa](https://github.com/SideProjectGuys/invite-manager-bot/commit/88b99faea2779c4911f77f1cefedd02b363f85ad))
- **ranks:** Fix fetching roles too often ([736b31b](https://github.com/SideProjectGuys/invite-manager-bot/commit/736b31bcc3081513c24e2e20b7ba96592bd0e256))

## [9.5.0](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.4.1...v9.5.0) (2020-03-30)

### Features

- **ic:** Redirect interactiveConfig to webpanel ([7576830](https://github.com/SideProjectGuys/invite-manager-bot/commit/7576830f1c91f8f8b5411df21691fc4b97ad7ba0))
- **requests:** Add custom request handler ([eb3adc7](https://github.com/SideProjectGuys/invite-manager-bot/commit/eb3adc7aeeb27b00beae6813a0ddd3a8161a1d8a))

### Bug Fixes

- **lockdown:** Fix scheduled action description ([6c29944](https://github.com/SideProjectGuys/invite-manager-bot/commit/6c29944681f0b69c9ace46b51e1eda8bd6310e2f))

### [9.4.1](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.4.0...v9.4.1) (2020-03-26)

### Bug Fixes

- **lockdown:** Implement timeout ([fd226e6](https://github.com/SideProjectGuys/invite-manager-bot/commit/fd226e6edc9ad7676240e3d2966dda13f05f6285))
- **promotion:** Fix rank not found error ([8beeeaf](https://github.com/SideProjectGuys/invite-manager-bot/commit/8beeeaf0b16871fe8ccb9f2a8dac792eb98c19a3))

## [9.4.0](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.3.0...v9.4.0) (2020-03-26)

### Features

- **activity:** Remove db stats ([8d17416](https://github.com/SideProjectGuys/invite-manager-bot/commit/8d174164326571f510e93fea09c1146c4c8e1938))
- **canvas:** Change module for node v12 support ([5c2a86d](https://github.com/SideProjectGuys/invite-manager-bot/commit/5c2a86dfe28f15cc630a438750df35a858eea4fe))
- **commands:** Add channel info for errors ([5371ffc](https://github.com/SideProjectGuys/invite-manager-bot/commit/5371ffcb71a21e20d6cb8095310bdff9172be3d4))
- **console:** Use chalk for colors ([6a6135a](https://github.com/SideProjectGuys/invite-manager-bot/commit/6a6135ae634ef8e5a0586c338cc08ceb8f5a7d1f))
- **docs:** Insert new translations ([00edc32](https://github.com/SideProjectGuys/invite-manager-bot/commit/00edc32755286a0d34b1473a411c330a1d62da1c))
- **i18n:** Add missing strings ([c7c0cae](https://github.com/SideProjectGuys/invite-manager-bot/commit/c7c0cae5edf44e458b6f7dc599450dad196f9d6e))
- **i18n:** Add more missing translations ([874255a](https://github.com/SideProjectGuys/invite-manager-bot/commit/874255a78546f3be5c53c9739aa8210e0bfcceb8))
- **i18n:** Update translations ([2313f42](https://github.com/SideProjectGuys/invite-manager-bot/commit/2313f42b931463eb18d96ed1c9982c5b1f82dd3e))
- **i18n:** Update translations ([e0f6dc8](https://github.com/SideProjectGuys/invite-manager-bot/commit/e0f6dc89a2e77e7393ea0479d431027147ff3262))
- **i18n:** Update translations ([0a7ac31](https://github.com/SideProjectGuys/invite-manager-bot/commit/0a7ac3150ae291f7da9602d8afeaa2791e5f2455))
- **i18n:** Update translations ([4806ef3](https://github.com/SideProjectGuys/invite-manager-bot/commit/4806ef3e2d99877dcb9df4bf77716bdfc2edf86d))
- **i18n:** Update translations & docs ([dbfd144](https://github.com/SideProjectGuys/invite-manager-bot/commit/dbfd1447dbb20792595f076e2cf55f94e71d52ce))
- **invites:** Use cache for guild vanity URL ([5a4f517](https://github.com/SideProjectGuys/invite-manager-bot/commit/5a4f51704961e3b3d2848324c2dcd83d104153ac))
- **join-roles:** Add join roles config ([1fb4b5f](https://github.com/SideProjectGuys/invite-manager-bot/commit/1fb4b5f2ef1023d4d0dddee39f0cc028de9050f7))
- **lockdown:** Add lockdown command ([8c8d286](https://github.com/SideProjectGuys/invite-manager-bot/commit/8c8d286ac3bfb3a01f7f5be5da1a051b486e3805))
- **lockdown:** Update messages ([efa89f1](https://github.com/SideProjectGuys/invite-manager-bot/commit/efa89f1dedbd538f80fbb05c346ffb26e31246bc))
- **mq:** Remove gateway info ([71b6faa](https://github.com/SideProjectGuys/invite-manager-bot/commit/71b6faa128f8aa8cf1ee0e8333cfcb3db656001b))
- **premium:** Add staff flag ([5ca225c](https://github.com/SideProjectGuys/invite-manager-bot/commit/5ca225cd1594509cb9438e20aeea34cc8879afec))
- **premium:** Improve premium handling ([23f54d6](https://github.com/SideProjectGuys/invite-manager-bot/commit/23f54d604dbb4fe036955d145970acd37cc234b7))
- **rabbitmq:** Add more status stats ([0c4b5a5](https://github.com/SideProjectGuys/invite-manager-bot/commit/0c4b5a571f2c0959e8ef9fae44cb6a03eacb89dd))
- **rabbitmq:** Add priority to restarts ([f78c590](https://github.com/SideProjectGuys/invite-manager-bot/commit/f78c590f76444d59872c1978f8e1386316b92007))
- **rabbitmq:** Add timestamp to gateway update ([081d012](https://github.com/SideProjectGuys/invite-manager-bot/commit/081d012d2c9e3f0d1124fb5e063e40138042eafe))
- **reaction-roles:** Add reaction roles ([be67b2e](https://github.com/SideProjectGuys/invite-manager-bot/commit/be67b2e8b76ec9fbe6b1f119f5489817a4843840))
- **scheduler:** Add some logging ([6e07e71](https://github.com/SideProjectGuys/invite-manager-bot/commit/6e07e716b63e20b49a3d2940fbdf54d2266eebe2))
- **services:** Normalize services ([9e07b8c](https://github.com/SideProjectGuys/invite-manager-bot/commit/9e07b8c2b8d95968103e7441c5434b3e2d058577))
- **startup:** Add ticket system ([cf01bc6](https://github.com/SideProjectGuys/invite-manager-bot/commit/cf01bc6cbfb77e6b42fcffe74ca8eed7c65fe1e2))
- **status:** Add more stats ([ff878e5](https://github.com/SideProjectGuys/invite-manager-bot/commit/ff878e5593d30e63f435c7ff15d27d0f59626fc3))
- **status:** Add startup status info ([63e3990](https://github.com/SideProjectGuys/invite-manager-bot/commit/63e39900e92fd4a5572d74310e29a56d9fe981b8))
- **status:** Reduce data sent ([a9c360e](https://github.com/SideProjectGuys/invite-manager-bot/commit/a9c360e7b7c1975563780fd5bdb9b5a27c8ecbcb))
- **status:** Track more events ([d1ffd5d](https://github.com/SideProjectGuys/invite-manager-bot/commit/d1ffd5dcc8aa42c80f48df34bc6382173d5fd65b))
- **tracking:** Track updates to channels & roles ([68c564b](https://github.com/SideProjectGuys/invite-manager-bot/commit/68c564b3502de0462f9824eaa8e041f355f0c96d))

### Bug Fixes

- **clean:** Remove emoji permission requirement ([b941b73](https://github.com/SideProjectGuys/invite-manager-bot/commit/b941b738b097075fd9e8666d2621732c7b965d65))
- **client:** Remove user update ([d26290d](https://github.com/SideProjectGuys/invite-manager-bot/commit/d26290d4688c0c42e9d9e8fff44d6fd3657e496b))
- **client:** Track user update ([0dab41e](https://github.com/SideProjectGuys/invite-manager-bot/commit/0dab41eb26c1bd871f98472e6e35b2659e8c8093))
- **comands:** Fix only loading first command ([ea8c682](https://github.com/SideProjectGuys/invite-manager-bot/commit/ea8c682951c0adbc8fccedd14e62fd293ff0d676))
- **db:** Fix duplicate join ([1b6faf3](https://github.com/SideProjectGuys/invite-manager-bot/commit/1b6faf37e66aa9e38c9f1d668b99089e148201fa))
- **db:** Fix find on all shards ([4cd22f6](https://github.com/SideProjectGuys/invite-manager-bot/commit/4cd22f65516e86b87dd4fe363ce68ff97d24afa3))
- **db:** Fix primary key constraint errors ([a4e9427](https://github.com/SideProjectGuys/invite-manager-bot/commit/a4e9427619047e395e4721e15799f8c98b3bf6cc))
- **db:** Fix saving premium ([216c95b](https://github.com/SideProjectGuys/invite-manager-bot/commit/216c95b0086918c2102764517bad7177534b35bc))
- **db:** Rename db function for clarity ([484262c](https://github.com/SideProjectGuys/invite-manager-bot/commit/484262cb1e844f1107b701fe7e63b9a9a5a1c6e4))
- **db:** Update scripts ([1342d5d](https://github.com/SideProjectGuys/invite-manager-bot/commit/1342d5d4b0224b385dcc1bbdfdbd701f6cdaa2bf))
- **db:** Use text columns for user data ([d272fa0](https://github.com/SideProjectGuys/invite-manager-bot/commit/d272fa0a936e7770d069846e8efa2f8f1dc8fc49))
- **graph:** Fix current day ([76b3746](https://github.com/SideProjectGuys/invite-manager-bot/commit/76b3746c1fba5867b1d541e6eafe267d663ca207))
- **graph:** Fix graph ([7437d74](https://github.com/SideProjectGuys/invite-manager-bot/commit/7437d7423f62de1ddb0dc0f6fdcbb8e4425f6c04))
- **graph:** Fix graph and add combined graph ([e009c1a](https://github.com/SideProjectGuys/invite-manager-bot/commit/e009c1a775d08cc7a088873518a8e69e2d9eab86))
- **graph:** More fixes ([51325b0](https://github.com/SideProjectGuys/invite-manager-bot/commit/51325b02ac8d8c23f38ca10b3c244e227a25e609))
- **graph:** Use start and end of day ([36ecbd0](https://github.com/SideProjectGuys/invite-manager-bot/commit/36ecbd07fc3a99453138002492349f7f93c36fe5))
- **i18n:** Add missing english translations ([587fcda](https://github.com/SideProjectGuys/invite-manager-bot/commit/587fcdabf12201d1d1a3057107cb84bdda1e63a0))
- **i18n:** Add missing string ([49ef243](https://github.com/SideProjectGuys/invite-manager-bot/commit/49ef2433f780ee9873a010ed27d8d7d5846189b9))
- **info:** Fix missing message ([c066ea7](https://github.com/SideProjectGuys/invite-manager-bot/commit/c066ea78369d2055f2e67f95f08a72b3c82c70a6))
- **invites:** correctly use vanityURL cache ([f766bda](https://github.com/SideProjectGuys/invite-manager-bot/commit/f766bda2713396d096be1c73fad37957329278ae))
- **lockdown:** Fix missing return ([5ee3ea6](https://github.com/SideProjectGuys/invite-manager-bot/commit/5ee3ea6618a6bc0350f168fbd31833cc0e1d1ef0))
- **lockdown:** Require bot permissions ([931395a](https://github.com/SideProjectGuys/invite-manager-bot/commit/931395a9ee4f3b9bf08d227d92d9939b3c2c4301))
- **members:** Fix editing message ([762297e](https://github.com/SideProjectGuys/invite-manager-bot/commit/762297ed940544f15b468ecf204556882b4e3e97))
- **members:** Use cached members for efficiency ([e5fe390](https://github.com/SideProjectGuys/invite-manager-bot/commit/e5fe390b1354cedd5b1a2c91815f2007bd04af1c))
- **messaging:** Fix error while handling error ([61112da](https://github.com/SideProjectGuys/invite-manager-bot/commit/61112dad4a4006cfa8daf4a8aeb89493d9fa29b7))
- **moderation:** Fix punishments ([feb0f22](https://github.com/SideProjectGuys/invite-manager-bot/commit/feb0f22f60a6cfe35d6cc7a4cd9fe7b0ed7271c7))
- **music:** Fix build error ([17812bb](https://github.com/SideProjectGuys/invite-manager-bot/commit/17812bb10bf7ae414a79252d292fffdd787aaad5))
- **permissions:** Fix changing interactive config ([7b33c08](https://github.com/SideProjectGuys/invite-manager-bot/commit/7b33c089337d2f65fc9e6791cd1524eb6fd3c33e))
- **permissions:** Fix output for [@everyone](https://github.com/everyone) role ([0d1e58c](https://github.com/SideProjectGuys/invite-manager-bot/commit/0d1e58cb81409ba8b4b578b2a2064b4a1f7b997f))
- **premium:** Check premium in intervals ([7faeb03](https://github.com/SideProjectGuys/invite-manager-bot/commit/7faeb0387b3a1e60c6e65d2d9ebcb8c2788f40f7))
- **premium:** Fix check url ([69eed82](https://github.com/SideProjectGuys/invite-manager-bot/commit/69eed828c8038e4898ba775eb2430c3666cf42ab))
- **premium:** Fix permissions for premium command ([d89baa2](https://github.com/SideProjectGuys/invite-manager-bot/commit/d89baa2e1f7fe305cc295f2727c739bb62e7e880))
- **premium:** Increase timeout ([c60d4bb](https://github.com/SideProjectGuys/invite-manager-bot/commit/c60d4bb38fbe8b355caf800b9c0853ae12f47f9d))
- **purge-until:** Fix message handling ([5649c0c](https://github.com/SideProjectGuys/invite-manager-bot/commit/5649c0cd405754fb506ea624c3ad330c9f1bfacb))
- **rabbitmq:** Fix status update ([249e904](https://github.com/SideProjectGuys/invite-manager-bot/commit/249e9044418a51362c9b47054079853d1b271450))
- **ranks:** Use text instead of varchar ([2aa0e1c](https://github.com/SideProjectGuys/invite-manager-bot/commit/2aa0e1c33638108d07fa92b02981198eb28c68b8))
- **reaction-roles:** Fix animated emojis ([55186f8](https://github.com/SideProjectGuys/invite-manager-bot/commit/55186f8ba4e1efcb520e433d16d96009b7c0844c))
- **reaction-roles:** Fix reaction on all messages ([59cb7b8](https://github.com/SideProjectGuys/invite-manager-bot/commit/59cb7b8e8920e08d1eccce010c86157d4e7c7d91))
- **reactionRoles:** Fix emoji mix-up ([be5baa9](https://github.com/SideProjectGuys/invite-manager-bot/commit/be5baa92454b426b2bc2600627853862a229885a))
- **scheduler:** Fix unlocking channel not working ([b09dfda](https://github.com/SideProjectGuys/invite-manager-bot/commit/b09dfdac5eb0c62a43fae2e486658338a586602a))
- **soundcloud:** Update client id ([889bc70](https://github.com/SideProjectGuys/invite-manager-bot/commit/889bc70f5b600e6c4e29c1b3d2874a133c414064))
- **startup:** Add some more color ([34ce803](https://github.com/SideProjectGuys/invite-manager-bot/commit/34ce8035c327c652ec564ba62ca44846865b44cb))
- **startup:** Fix returning ticket causing restart ([1c61f26](https://github.com/SideProjectGuys/invite-manager-bot/commit/1c61f2699b00f7afe111f4b7612aee0efeedd999))
- **startup:** Prepare for startup gates ([bda4f86](https://github.com/SideProjectGuys/invite-manager-bot/commit/bda4f862517272ef2eda47bfe31e4056eda3c7ba))
- **status:** Clean up status report ([3d6c857](https://github.com/SideProjectGuys/invite-manager-bot/commit/3d6c857bc4d40da47f5897f0c675de1c8ab3a4b9))
- **status:** Fix startup time. Add state ([e3e390a](https://github.com/SideProjectGuys/invite-manager-bot/commit/e3e390a6e339f51412ba12f6aa3f2cb7ffafac19))
- **status:** Only send relevant info ([8a899c2](https://github.com/SideProjectGuys/invite-manager-bot/commit/8a899c2f5a61a4a384570d09b15819848a857154))

## [9.3.0](https://github.com/SideProjectGuys/invite-manager-bot/compare/v9.2.8...v9.3.0) (2020-03-24)

### Features

- **activity:** Remove db stats ([8d17416](https://github.com/SideProjectGuys/invite-manager-bot/commit/8d174164326571f510e93fea09c1146c4c8e1938))
- **commands:** Add channel info for errors ([5371ffc](https://github.com/SideProjectGuys/invite-manager-bot/commit/5371ffcb71a21e20d6cb8095310bdff9172be3d4))
- **i18n:** Add missing strings ([c7c0cae](https://github.com/SideProjectGuys/invite-manager-bot/commit/c7c0cae5edf44e458b6f7dc599450dad196f9d6e))
- **i18n:** Add more missing translations ([874255a](https://github.com/SideProjectGuys/invite-manager-bot/commit/874255a78546f3be5c53c9739aa8210e0bfcceb8))
- **i18n:** Update translations ([0a7ac31](https://github.com/SideProjectGuys/invite-manager-bot/commit/0a7ac3150ae291f7da9602d8afeaa2791e5f2455))
- **i18n:** Update translations ([4806ef3](https://github.com/SideProjectGuys/invite-manager-bot/commit/4806ef3e2d99877dcb9df4bf77716bdfc2edf86d))
- **i18n:** Update translations ([e0f6dc8](https://github.com/SideProjectGuys/invite-manager-bot/commit/e0f6dc89a2e77e7393ea0479d431027147ff3262))
- **i18n:** Update translations & docs ([dbfd144](https://github.com/SideProjectGuys/invite-manager-bot/commit/dbfd1447dbb20792595f076e2cf55f94e71d52ce))
- **invites:** Use cache for guild vanity URL ([5a4f517](https://github.com/SideProjectGuys/invite-manager-bot/commit/5a4f51704961e3b3d2848324c2dcd83d104153ac))
- **join-roles:** Add join roles config ([1fb4b5f](https://github.com/SideProjectGuys/invite-manager-bot/commit/1fb4b5f2ef1023d4d0dddee39f0cc028de9050f7))
- **lockdown:** Add lockdown command ([8c8d286](https://github.com/SideProjectGuys/invite-manager-bot/commit/8c8d286ac3bfb3a01f7f5be5da1a051b486e3805))
- **lockdown:** Update messages ([efa89f1](https://github.com/SideProjectGuys/invite-manager-bot/commit/efa89f1dedbd538f80fbb05c346ffb26e31246bc))
- **mq:** Remove gateway info ([71b6faa](https://github.com/SideProjectGuys/invite-manager-bot/commit/71b6faa128f8aa8cf1ee0e8333cfcb3db656001b))
- **premium:** Add staff flag ([5ca225c](https://github.com/SideProjectGuys/invite-manager-bot/commit/5ca225cd1594509cb9438e20aeea34cc8879afec))
- **premium:** Improve premium handling ([23f54d6](https://github.com/SideProjectGuys/invite-manager-bot/commit/23f54d604dbb4fe036955d145970acd37cc234b7))
- **rabbitmq:** Add more status stats ([0c4b5a5](https://github.com/SideProjectGuys/invite-manager-bot/commit/0c4b5a571f2c0959e8ef9fae44cb6a03eacb89dd))
- **rabbitmq:** Add timestamp to gateway update ([081d012](https://github.com/SideProjectGuys/invite-manager-bot/commit/081d012d2c9e3f0d1124fb5e063e40138042eafe))
- **reaction-roles:** Add reaction roles ([be67b2e](https://github.com/SideProjectGuys/invite-manager-bot/commit/be67b2e8b76ec9fbe6b1f119f5489817a4843840))
- **scheduler:** Add some logging ([6e07e71](https://github.com/SideProjectGuys/invite-manager-bot/commit/6e07e716b63e20b49a3d2940fbdf54d2266eebe2))
- **services:** Normalize services ([9e07b8c](https://github.com/SideProjectGuys/invite-manager-bot/commit/9e07b8c2b8d95968103e7441c5434b3e2d058577))
- **startup:** Add ticket system ([cf01bc6](https://github.com/SideProjectGuys/invite-manager-bot/commit/cf01bc6cbfb77e6b42fcffe74ca8eed7c65fe1e2))
- **status:** Add more stats ([ff878e5](https://github.com/SideProjectGuys/invite-manager-bot/commit/ff878e5593d30e63f435c7ff15d27d0f59626fc3))
- **status:** Add startup status info ([63e3990](https://github.com/SideProjectGuys/invite-manager-bot/commit/63e39900e92fd4a5572d74310e29a56d9fe981b8))
- **status:** Reduce data sent ([a9c360e](https://github.com/SideProjectGuys/invite-manager-bot/commit/a9c360e7b7c1975563780fd5bdb9b5a27c8ecbcb))
- **status:** Track more events ([d1ffd5d](https://github.com/SideProjectGuys/invite-manager-bot/commit/d1ffd5dcc8aa42c80f48df34bc6382173d5fd65b))
- **tracking:** Track updates to channels & roles ([68c564b](https://github.com/SideProjectGuys/invite-manager-bot/commit/68c564b3502de0462f9824eaa8e041f355f0c96d))

### Bug Fixes

- **clean:** Remove emoji permission requirement ([b941b73](https://github.com/SideProjectGuys/invite-manager-bot/commit/b941b738b097075fd9e8666d2621732c7b965d65))
- **client:** Remove user update ([d26290d](https://github.com/SideProjectGuys/invite-manager-bot/commit/d26290d4688c0c42e9d9e8fff44d6fd3657e496b))
- **client:** Track user update ([0dab41e](https://github.com/SideProjectGuys/invite-manager-bot/commit/0dab41eb26c1bd871f98472e6e35b2659e8c8093))
- **db:** Fix duplicate join ([1b6faf3](https://github.com/SideProjectGuys/invite-manager-bot/commit/1b6faf37e66aa9e38c9f1d668b99089e148201fa))
- **db:** Fix find on all shards ([4cd22f6](https://github.com/SideProjectGuys/invite-manager-bot/commit/4cd22f65516e86b87dd4fe363ce68ff97d24afa3))
- **db:** Fix primary key constraint errors ([a4e9427](https://github.com/SideProjectGuys/invite-manager-bot/commit/a4e9427619047e395e4721e15799f8c98b3bf6cc))
- **db:** Fix saving premium ([216c95b](https://github.com/SideProjectGuys/invite-manager-bot/commit/216c95b0086918c2102764517bad7177534b35bc))
- **db:** Rename db function for clarity ([484262c](https://github.com/SideProjectGuys/invite-manager-bot/commit/484262cb1e844f1107b701fe7e63b9a9a5a1c6e4))
- **db:** Update scripts ([1342d5d](https://github.com/SideProjectGuys/invite-manager-bot/commit/1342d5d4b0224b385dcc1bbdfdbd701f6cdaa2bf))
- **db:** Use text columns for user data ([d272fa0](https://github.com/SideProjectGuys/invite-manager-bot/commit/d272fa0a936e7770d069846e8efa2f8f1dc8fc49))
- **graph:** Fix current day ([76b3746](https://github.com/SideProjectGuys/invite-manager-bot/commit/76b3746c1fba5867b1d541e6eafe267d663ca207))
- **graph:** Fix graph ([7437d74](https://github.com/SideProjectGuys/invite-manager-bot/commit/7437d7423f62de1ddb0dc0f6fdcbb8e4425f6c04))
- **graph:** Fix graph and add combined graph ([e009c1a](https://github.com/SideProjectGuys/invite-manager-bot/commit/e009c1a775d08cc7a088873518a8e69e2d9eab86))
- **graph:** More fixes ([51325b0](https://github.com/SideProjectGuys/invite-manager-bot/commit/51325b02ac8d8c23f38ca10b3c244e227a25e609))
- **graph:** Use start and end of day ([36ecbd0](https://github.com/SideProjectGuys/invite-manager-bot/commit/36ecbd07fc3a99453138002492349f7f93c36fe5))
- **i18n:** Add missing english translations ([587fcda](https://github.com/SideProjectGuys/invite-manager-bot/commit/587fcdabf12201d1d1a3057107cb84bdda1e63a0))
- **i18n:** Add missing string ([49ef243](https://github.com/SideProjectGuys/invite-manager-bot/commit/49ef2433f780ee9873a010ed27d8d7d5846189b9))
- **info:** Fix missing message ([c066ea7](https://github.com/SideProjectGuys/invite-manager-bot/commit/c066ea78369d2055f2e67f95f08a72b3c82c70a6))
- **invites:** correctly use vanityURL cache ([f766bda](https://github.com/SideProjectGuys/invite-manager-bot/commit/f766bda2713396d096be1c73fad37957329278ae))
- **lockdown:** Fix missing return ([5ee3ea6](https://github.com/SideProjectGuys/invite-manager-bot/commit/5ee3ea6618a6bc0350f168fbd31833cc0e1d1ef0))
- **lockdown:** Require bot permissions ([931395a](https://github.com/SideProjectGuys/invite-manager-bot/commit/931395a9ee4f3b9bf08d227d92d9939b3c2c4301))
- **members:** Fix editing message ([762297e](https://github.com/SideProjectGuys/invite-manager-bot/commit/762297ed940544f15b468ecf204556882b4e3e97))
- **members:** Use cached members for efficiency ([e5fe390](https://github.com/SideProjectGuys/invite-manager-bot/commit/e5fe390b1354cedd5b1a2c91815f2007bd04af1c))
- **messaging:** Fix error while handling error ([61112da](https://github.com/SideProjectGuys/invite-manager-bot/commit/61112dad4a4006cfa8daf4a8aeb89493d9fa29b7))
- **moderation:** Fix punishments ([feb0f22](https://github.com/SideProjectGuys/invite-manager-bot/commit/feb0f22f60a6cfe35d6cc7a4cd9fe7b0ed7271c7))
- **music:** Fix build error ([17812bb](https://github.com/SideProjectGuys/invite-manager-bot/commit/17812bb10bf7ae414a79252d292fffdd787aaad5))
- **permissions:** Fix changing interactive config ([7b33c08](https://github.com/SideProjectGuys/invite-manager-bot/commit/7b33c089337d2f65fc9e6791cd1524eb6fd3c33e))
- **permissions:** Fix output for [@everyone](https://github.com/everyone) role ([0d1e58c](https://github.com/SideProjectGuys/invite-manager-bot/commit/0d1e58cb81409ba8b4b578b2a2064b4a1f7b997f))
- **premium:** Check premium in intervals ([7faeb03](https://github.com/SideProjectGuys/invite-manager-bot/commit/7faeb0387b3a1e60c6e65d2d9ebcb8c2788f40f7))
- **premium:** Fix check url ([69eed82](https://github.com/SideProjectGuys/invite-manager-bot/commit/69eed828c8038e4898ba775eb2430c3666cf42ab))
- **premium:** Fix permissions for premium command ([d89baa2](https://github.com/SideProjectGuys/invite-manager-bot/commit/d89baa2e1f7fe305cc295f2727c739bb62e7e880))
- **premium:** Increase timeout ([c60d4bb](https://github.com/SideProjectGuys/invite-manager-bot/commit/c60d4bb38fbe8b355caf800b9c0853ae12f47f9d))
- **purge-until:** Fix message handling ([5649c0c](https://github.com/SideProjectGuys/invite-manager-bot/commit/5649c0cd405754fb506ea624c3ad330c9f1bfacb))
- **rabbitmq:** Fix status update ([249e904](https://github.com/SideProjectGuys/invite-manager-bot/commit/249e9044418a51362c9b47054079853d1b271450))
- **ranks:** Use text instead of varchar ([2aa0e1c](https://github.com/SideProjectGuys/invite-manager-bot/commit/2aa0e1c33638108d07fa92b02981198eb28c68b8))
- **reaction-roles:** Fix animated emojis ([55186f8](https://github.com/SideProjectGuys/invite-manager-bot/commit/55186f8ba4e1efcb520e433d16d96009b7c0844c))
- **reaction-roles:** Fix reaction on all messages ([59cb7b8](https://github.com/SideProjectGuys/invite-manager-bot/commit/59cb7b8e8920e08d1eccce010c86157d4e7c7d91))
- **reactionRoles:** Fix emoji mix-up ([be5baa9](https://github.com/SideProjectGuys/invite-manager-bot/commit/be5baa92454b426b2bc2600627853862a229885a))
- **scheduler:** Fix unlocking channel not working ([b09dfda](https://github.com/SideProjectGuys/invite-manager-bot/commit/b09dfdac5eb0c62a43fae2e486658338a586602a))
- **soundcloud:** Update client id ([889bc70](https://github.com/SideProjectGuys/invite-manager-bot/commit/889bc70f5b600e6c4e29c1b3d2874a133c414064))
- **startup:** Add some more color ([34ce803](https://github.com/SideProjectGuys/invite-manager-bot/commit/34ce8035c327c652ec564ba62ca44846865b44cb))
- **startup:** Fix returning ticket causing restart ([1c61f26](https://github.com/SideProjectGuys/invite-manager-bot/commit/1c61f2699b00f7afe111f4b7612aee0efeedd999))
- **startup:** Prepare for startup gates ([bda4f86](https://github.com/SideProjectGuys/invite-manager-bot/commit/bda4f862517272ef2eda47bfe31e4056eda3c7ba))
