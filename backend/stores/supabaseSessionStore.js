
const session = require("express-session");
const supabase = require("../config/database");

class SupabaseSessionStore extends session.Store {
  async get(sid, callback) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("sess, expire")
        .eq("sid", sid)
        .maybeSingle();

      if (error) throw error;

      if (!data) return callback(null, null);

      if (new Date(data.expire) <= new Date()) {
        await this.destroy(sid, () => {});
        return callback(null, null);
      }

      callback(null, data.sess);
    } catch (error) {
      callback(error);
    }
  }

  async set(sid, sess, callback = () => {}) {
    try {
      const expire = sess.cookie?.expires
        ? new Date(sess.cookie.expires).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase.from("sessions").upsert(
        { sid, sess, expire },
        { onConflict: "sid" }
      );

      if (error) throw error;
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async destroy(sid, callback = () => {}) {
    try {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("sid", sid);

      if (error) throw error;
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async touch(sid, sess, callback = () => {}) {
    return this.set(sid, sess, callback);
  }
}

module.exports = SupabaseSessionStore;
