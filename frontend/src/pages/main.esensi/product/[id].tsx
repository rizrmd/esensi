import { useParams } from "@/lib/hooks/use-router";

export default () => {
    const { params, hash } = useParams();
    console.log('asfoiasnfio', params);
    return <>haloha {params.id} {JSON.stringify(hash)}</>
}