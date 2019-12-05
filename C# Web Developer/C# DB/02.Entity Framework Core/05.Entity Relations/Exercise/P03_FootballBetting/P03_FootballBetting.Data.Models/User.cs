﻿namespace P03_FootballBetting.Data.Models
{
    using System.Collections.Generic;

    public class User
    {
        //------------ Properties -------------
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public decimal Balance { get; set; }

        //-------- Bets ------- [FK]
        public ICollection<Bet> Bets { get; set; } = new HashSet<Bet>();
    }
}