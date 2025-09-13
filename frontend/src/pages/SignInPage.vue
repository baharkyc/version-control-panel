<script setup>

import Header from '../components/Header.vue';
import SignInForm from '../components/SignInForm.vue';
import { useRouter } from 'vue-router';

//router instance
const router = useRouter();

//handle successful login event from SignInForm
const onSuccess = (payload) => {
    alert('Sign in successful!')

    router.push('/');
}

</script>

<template>
    <div class="flex flex-col py-8">
        <Header></Header>
        <SignInForm
            @login-success="onSuccess"/>
    </div>
    
    
</template>
