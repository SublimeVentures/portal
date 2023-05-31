function checkAcl(session, req) {
    return {
        ACL: session?.user?.ACL>=0 ? session.user.ACL : Number(req.query.acl),
        ADDRESS: session?.user?.address ? session.user.address : req.query.address,
        USER: session?.user,
    }
}

module.exports = {checkAcl}
