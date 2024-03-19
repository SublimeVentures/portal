const tenant = process.env.NEXT_PUBLIC_TENANT || "1";

module.exports = {
    plugins: {
        tailwindcss: `./tailwind/config.tenant_${tenant}.js`,
        autoprefixer: {},
    },
};
