import { useQuery } from '@tanstack/react-query';
import { claimContractAddress } from '../../constant';
import { lcd } from '../../lcd';

export interface ClaimDataResponse {
  address: string,
  vestings: UserClaimData[]
}

export interface UserClaimData {
  stage: number,
  info: {
    name: string
  },
  amounts: {
    total: string,
    claimable: string,
  }
}

const useGetUserCanClaimStage = (userAddress: string) => {
  const contractAddress = claimContractAddress;
  return useQuery({
    queryKey: ['useGetUserCanClaimStage', userAddress, contractAddress],
    queryFn: async () => {
      try {
        const data = await lcd.wasm.contractQuery<ClaimDataResponse>(contractAddress, {
          "vesting_account": {
            "address": userAddress
          }
        });
        return data.vestings;
      } catch (e) {
        console.log(e);
      }
    },
  })
}

export default useGetUserCanClaimStage;



// {
//   "data": {
//     "address": "xpla1u7tdvepstkyr2w8utfk8cffzska488x5zc4rer",
//     "vestings": [
//       {
//         "stage": 1,
//         "schedule": {
//           "style": "linear",
//           "token": {
//             "native": {
//               "denom": "axpla"
//             }
//           },
//           "start_time": "1721888469",
//           "end_time": "1721888469",
//           "time_interval": null,
//           "month": null,
//           "day": null,
//           "weekday": null,
//           "hour": null
//         },
//         "info": {
//           "name": "round3",
//           "description": null,
//           "icon": null,
//           "image": null,
//           "webpage": null
//         },
//         "amounts": {
//           "total": "700000000000000000",
//           "vested": "700000000000000000",
//           "claimed": "0",
//           "claimable": "700000000000000000"
//         },
//         "readable": {
//           "schedule_start_time": "2024-07-25T06:21:09Z",
//           "schedule_end_time": "2024-07-25T06:21:09Z",
//           "schedule_time_interval": "",
//           "amounts_total": "0.7 XPLA",
//           "amounts_vested": "0.7 XPLA",
//           "amounts_claimed": "0 XPLA",
//           "amounts_claimable": "0.7 XPLA",
//           "status_sum_amounts": "",
//           "status_sum_claimed": ""
//         }
//       },
//       {
//         "stage": 3,
//         "schedule": {
//           "style": "linear",
//           "token": {
//             "native": {
//               "denom": "axpla"
//             }
//           },
//           "start_time": "1721888486",
//           "end_time": "1721888486",
//           "time_interval": null,
//           "month": null,
//           "day": null,
//           "weekday": null,
//           "hour": null
//         },
//         "info": {
//           "name": "round15",
//           "description": null,
//           "icon": null,
//           "image": null,
//           "webpage": null
//         },
//         "amounts": {
//           "total": "700000000000000000",
//           "vested": "700000000000000000",
//           "claimed": "0",
//           "claimable": "700000000000000000"
//         },
//         "readable": {
//           "schedule_start_time": "2024-07-25T06:21:26Z",
//           "schedule_end_time": "2024-07-25T06:21:26Z",
//           "schedule_time_interval": "",
//           "amounts_total": "0.7 XPLA",
//           "amounts_vested": "0.7 XPLA",
//           "amounts_claimed": "0 XPLA",
//           "amounts_claimable": "0.7 XPLA",
//           "status_sum_amounts": "",
//           "status_sum_claimed": ""
//         }
//       },
//       {
//         "stage": 4,
//         "schedule": {
//           "style": "linear",
//           "token": {
//             "native": {
//               "denom": "axpla"
//             }
//           },
//           "start_time": "1721888498",
//           "end_time": "1721888498",
//           "time_interval": null,
//           "month": null,
//           "day": null,
//           "weekday": null,
//           "hour": null
//         },
//         "info": {
//           "name": "round16",
//           "description": null,
//           "icon": null,
//           "image": null,
//           "webpage": null
//         },
//         "amounts": {
//           "total": "700000000000000000",
//           "vested": "700000000000000000",
//           "claimed": "0",
//           "claimable": "700000000000000000"
//         },
//         "readable": {
//           "schedule_start_time": "2024-07-25T06:21:38Z",
//           "schedule_end_time": "2024-07-25T06:21:38Z",
//           "schedule_time_interval": "",
//           "amounts_total": "0.7 XPLA",
//           "amounts_vested": "0.7 XPLA",
//           "amounts_claimed": "0 XPLA",
//           "amounts_claimable": "0.7 XPLA",
//           "status_sum_amounts": "",
//           "status_sum_claimed": ""
//         }
//       },
//       {
//         "stage": 5,
//         "schedule": {
//           "style": "linear",
//           "token": {
//             "native": {
//               "denom": "axpla"
//             }
//           },
//           "start_time": "1721888510",
//           "end_time": "1721888510",
//           "time_interval": null,
//           "month": null,
//           "day": null,
//           "weekday": null,
//           "hour": null
//         },
//         "info": {
//           "name": "round20",
//           "description": null,
//           "icon": null,
//           "image": null,
//           "webpage": null
//         },
//         "amounts": {
//           "total": "2100000000000000000",
//           "vested": "2100000000000000000",
//           "claimed": "0",
//           "claimable": "2100000000000000000"
//         },
//         "readable": {
//           "schedule_start_time": "2024-07-25T06:21:50Z",
//           "schedule_end_time": "2024-07-25T06:21:50Z",
//           "schedule_time_interval": "",
//           "amounts_total": "2.1 XPLA",
//           "amounts_vested": "2.1 XPLA",
//           "amounts_claimed": "0 XPLA",
//           "amounts_claimable": "2.1 XPLA",
//           "status_sum_amounts": "",
//           "status_sum_claimed": ""
//         }
//       }
//     ],
//     "next": null
//   }
// }