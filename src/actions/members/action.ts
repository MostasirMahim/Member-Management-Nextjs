// 'use server'

// import { handleApi } from "@/lib/api"

// export default async function Post_Member(forms:any, formName?:string) {

//     let url = ''
//     if(formName){
//     url = `http://0.0.0.0:8000/api/member/v1/members/${formName}`
//     } else {
//         url =`http://0.0.0.0:8000/api/member/v1/members`
//     }

//     console.log(url, 'forms:', forms);


//     // try {
//     //     const result = await handleApi({'url': url, 'method': 'POST', 'body': forms })
//     //     if (result.code === 201){
//     //         return result
//     //     }else {
//     //         return {code: 400, message: 'Member information saving failed'}
//     //     }
//     // }
//     // catch(err){
//     //     console.error(`error occured while submitting member information, ${err}`)
//     // }

// }