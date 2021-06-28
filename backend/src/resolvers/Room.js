const Room = {
    objects(parent, args, { db, localDb, pubsub }, info) {
        return Promise.all(
            parent.objects.map((Id) => db.ObjectModel.findById(Id)),
        ); 
    },
};
export default Room;