export type Plan='free'|'pro'|'business'|'enterprise';
const rank:Record<Plan,number>={free:0,pro:1,business:2,enterprise:3};
export const limits:Record<Plan,{cards:number;members:number;analyticsDays:number;webhooks:boolean;branding:boolean}>={free:{cards:1,members:1,analyticsDays:7,webhooks:false,branding:false},pro:{cards:5,members:1,analyticsDays:90,webhooks:true,branding:true},business:{cards:100,members:100,analyticsDays:365,webhooks:true,branding:true},enterprise:{cards:100000,members:100000,analyticsDays:730,webhooks:true,branding:true}};
export function atLeast(plan:Plan,required:Plan){return rank[plan]>=rank[required];}
