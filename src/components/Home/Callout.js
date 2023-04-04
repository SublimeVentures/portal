import { ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import PlusIcon from "@/svg/Plus.svg";
import DiscordIcon from "@/svg/Discord.svg";
import TwitterIcon from "@/svg/Twitter.svg";
export default function Investors() {
  return (
  <div className="calloutGradient flex flex-col justify-center text-white pt-10">

    <div className="px-10 py-25 pb-35 flex flex-col gap-10 flex-1 mx-auto xl:max-w-[1400px]">
      <div className="flex flex-col text-white font-medium uppercase text-center w-full">
                  <div className="f-work text-xs ml-1">join us</div>
        <div className=" leading-snug text-3xl">
          LET'S WORK TOGETHER
        </div>
      </div>
      <div className=" text-center font-light">Join our discord to learn more and gain access to VC deal flow.
      </div>
      <div className="flex flex-col items-center mx-auto gap-5 md:flex-row">
        <a href="https://discord.gg/VzzRhasUVF" target="_blank">
          <RoundButton text={'Join'} is3d={true} isPrimary={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<DiscordIcon className={ButtonIconSize.hero}/>}/>
        </a>

        <PlusIcon className="w-8 text-white"/>

        <a href="https://twitter.com/3vcfund" target="_blank">
          <RoundButton text={'Follow'} is3d={true} isPrimary={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<TwitterIcon className={ButtonIconSize.hero}/>}/>

        </a>
      </div>
    </div>

  </div>

)}
//
// <script setup>
// import IconDiscord from '@/assets/svg/Discord.svg?component'
// import IconTwitter from '@/assets/svg/Twitter.svg?component'
// import IconPlus from '@/assets/svg/Plus.svg?component'
//
//
// // export default {
// //   name: 'About',
// //   components: {
// //     IconDiscord, IconTwitter, IconPlus
// //   },
// //   mounted() {
// //     // this.socket = this.$nuxtSocket({
// //     //   name: 'main',
// //     //   reconnection: true,
// //     // })
// //     // /* Listen for events: */
// //     // this.socket.on('msg', (msg) => {
// //     //     /* Handle event */
// //     //     console.log("tickkkkke!", msg)
// //     //   })
// //     // this.showInvestmentRisk = !(this.$cookie.get('investmentReminder')?.length > 5);
// //     // this.$store.dispatch('citizen/autoLogin', {}, {root: true})
// //     // document.onreadystatechange = () => {
// //     //   if (document.readyState === 'complete') {
// //     //     this.$store.commit('system/showLoading', {
// //     //       type: 'assets',
// //     //       status: true
// //     //     })
// //     //   }
// //     // }
// //
// //   },
// //   methods: {
// //     method1() {
// //       console.log("aaa2")
// //       /* Emit events */
// //       this.socket.emit('hello', {
// //         hello: 'world'
// //       }, (resp) => {
// //         /* Handle response, if any */
// //       })
// //     },
// //     async method2() {
// //       const aaa = await this.$axios.$get('/api/test')
// //       console.log("aaa",aaa)
// //     },
// //     // handleReminder(){
// //     //   this.$cookie.set('investmentReminder', `${this.$moment.now()}`, 30)
// //     //   this.showInvestmentRisk = false;
// //     // },
// //     async login(){
// //       const web3 = new this.$Web3(ethereum);
// //       const wallets = await web3.currentProvider.request({ method: 'eth_requestAccounts' })
// //       console.log("dupa", wallets)
// //       this.wallets = wallets
// //       // window.web3 = new this.$Web3(window.ethereum);
// //     }
// //   },
// // }
// </script>
