<template>
  <aside class="flex  sticky top-0 z-50 collap:relative">
    <div class="p-7 flex flex-col border-r border-app-bg-split text-white max-h-screen sticky top-0  hidden collap:flex">
      <div class="flex">
        <NuxtLink to="/app" >
          <div class="f-work text-white text-2xl flex"><span class="blinking-cursor" style="">_</span>3VC</div>
        </NuxtLink>
      </div>
      <nav class="flex flex-col pt-10 flex-1 f-work text-md font-medium">
        <div class="flex flex-col gap-2">
          <NuxtLink v-for="item in groupUser" :to="item.link" :key="item.name" class="flex items-center px-5 py-2 rounded-xl sidebar-item" :class="{'disabled': item.disabled}" >
            <IconDashboard class="w-8 mr-3" v-if="item.icon ==='dashboard'"/>
            <IconVault class="w-8 mr-3" v-if="item.icon ==='vault'"/>
            <IconLight class="w-8 mr-3" v-if="item.icon ==='opp'"/>
            <IconExchange class="w-8 mr-3" v-if="item.icon ==='otc'"/>
            <IconBell class="w-8 mr-3" v-if="item.icon ==='bell'"/>
            {{item.name}}
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-2 mt-auto">
          <div  v-for="item in groupHelp" :key="item.name" class="cursor-pointer flex items-center px-5 py-2 rounded-xl sidebar-item" @click="openDiscord">
            <IconDiscord class="w-6 ml-1 mr-3" v-if="item.icon ==='discord'"/>
            <IconWiki class="w-6 ml-1 mr-3" v-if="item.icon ==='wiki'"/>
            {{item.name}}
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-12">
          <NuxtLink  v-for="item in groupProfile" :key="item.name" :to="item.link"  class="flex items-center px-5 py-2 rounded-xl sidebar-item">
            <IconLogout class="w-8 mr-3" v-if="item.icon ==='logout'"/>
            <IconSetting class="w-8 mr-3" v-else-if="item.icon ==='setting'"/>
            {{item.name}}
          </NuxtLink>
        </div>
      </nav>
    </div>
    <div class="p-5 flex blurredBgColor flex flex-1 -mt-1  border-b border-app-bg-split hamburger transition-colors duration-300 collap:hidden"  :class="{'!bg-navy-accent': mobileOpen}">
      <div class="mt-1 flex flex-row flex-1">
        <NuxtLink to="/app" >
          <div class="f-work text-white text-2xl flex"><span class="blinking-cursor" style="">_</span>3VC</div>
        </NuxtLink>
        <div class="flex flex-1 justify-end">
          <!--      <div class=" burger" :class="{'opened': mobileOpen}" @click="mobileOpen = !mobileOpen">-->
          <!--        <div></div>-->
          <!--      </div>-->
          <label for="check">
            <input type="checkbox" id="check" v-model="mobileOpen"/>
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
      </div>

    </div>
    <transition name="fade" mode="out-in">
      <div v-if="mobileOpen" class="absolute top-[72px] text-white bg-navy-accent flex flex-col w-full left-0 text-center py-10 px-12 text-uppercase tracking-widest f-montserrat">
        <div class="flex flex-col gap-2">
          <NuxtLink v-for="item in groupUser" :to="item.link" :key="item.name" class="flex items-center px-5 py-2 rounded-xl sidebar-item" :class="{'disabled': item.disabled}"  @click.native="mobileOpen=false">
            <IconDashboard class="w-8 mr-3" v-if="item.icon ==='dashboard'"/>
            <IconVault class="w-8 mr-3" v-if="item.icon ==='vault'"/>
            <IconLight class="w-8 mr-3" v-if="item.icon ==='opp'"/>
            <IconExchange class="w-8 mr-3" v-if="item.icon ==='otc'"/>
            <IconBell class="w-8 mr-3" v-if="item.icon ==='bell'"/>
            {{item.name}}
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <div  v-for="item in groupHelp" :key="item.name" class="cursor-pointer flex items-center px-5 py-2 rounded-xl sidebar-item" @click="openDiscord">
            <IconDiscord class="w-6 ml-1 mr-3" v-if="item.icon ==='discord'"/>
            <IconWiki class="w-6 ml-1 mr-3" v-if="item.icon ==='wiki'"/>
            {{item.name}}
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <NuxtLink  v-for="item in groupProfile" :key="item.name" :to="item.link"  class="flex items-center px-5 py-2 rounded-xl sidebar-item"  @click.native="mobileOpen=false">
            <IconLogout class="w-8 mr-3" v-if="item.icon ==='logout'"/>
            <IconSetting class="w-8 mr-3" v-else-if="item.icon ==='setting'"/>
            {{item.name}}
          </NuxtLink>
        </div>
      </div>
    </transition>

  </aside>

</template>

<script>
export default {
  name: 'Sidebar',
  components: {
  },
  mounted() {

  },
  methods: {
    openDiscord() {
      window.open( "https://discord.gg/3SaqVVdzUH", '_blank');
      this.mobileOpen = false;
    }
  },
  data: () => ({
    mobileOpen: false,
    groupUser: [
      {name: 'Dashboard', link:'/app', icon:'dashboard'},
      {name: 'Vault', link:'/app/vault', icon:'vault'},
      {name: 'Opportunities', link:'/app/invest', icon:'opp'},
      {name: 'OTC', link:'/app/otc', icon:'otc'},
      {name: 'Notifications', link:'/app', icon:'bell', disabled: true},
    ],
    groupHelp: [
      {name: 'Community', link:'discord', icon:'discord', external: true},
      {name: 'Wiki', link:'notion', icon:'wiki',  external: true},
    ],
    groupProfile: [
      {name: 'Settings', link:'/app/settings', icon:'setting'},
      {name: 'Log out', link:'/app', icon:'logout'},
    ]
  }),
}
</script>
