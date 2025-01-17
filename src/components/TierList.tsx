import React, { useState, useRef,useEffect } from 'react';
import { TeamTables } from './TeamTables';
import { Player, TeamData} from '../types';
import {Save} from 'lucide-react'
import { toPng } from 'html-to-image';

interface TierListInputProps {
  fullplayers: Player[];
  fullteams: TeamData[];
  logo : string
}

export const TierList: React.FC<TierListInputProps> = ({fullplayers, fullteams, logo}) => {
  const [players, setPlayers] = useState<Player[]>(fullplayers);
  const [teamRanking, setTeamRanking] = useState<TeamData[]>(fullteams);
  const [loading, setLoading] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    setPlayers(fullplayers);
    setTeamRanking(fullteams);
  }, [fullplayers, fullteams]);

  const saveAsPng = async () => {
    if (tableRef.current) {
      setLoading(true);
      tableRef.current.style.display = "block";
      const pngDataUrl = await toPng(tableRef.current, { quality: 1.0 });
      const link = document.createElement('a');
      link.download = 'my-rank2025';
      link.href = pngDataUrl;
      link.click();
      tableRef.current.style.display = "none";
      setLoading(false);
    }
  }

  const handleUpdatePlayerTier = (playerId: string, tier: string) => {
    setPlayers(currentPlayers =>
      currentPlayers.map(player =>
        player.id === playerId ? { ...player, tier } : player
      )
    );
  };

  const handleUpdateTeamRank = (team: TeamData, newRank: number) => {

    setTeamRanking((currentTeamRanks) => {
      const oldRank = team.rank;
  
      return currentTeamRanks.map((teamRank) => {
        
        if (teamRank.id === team.id) {
          return { ...teamRank, rank: newRank };
        }
  
        if (teamRank.rank === newRank) {
          return { ...teamRank, rank: oldRank };
        }  
        return teamRank;
      });
    })}

  return (
    <div className='bg-[#251c0d]'>

    <div ref={tableRef} className='bg-[#251c0d]' style={{ display:"none", width: "1096px", height: "auto" }}>
    <div className='px-4 py-4 flex items-center'>
        <img src={logo} alt="Logo" className='w-16' />
        <h1 className="text-2xl  text-white text-left mt-8 ml-4">
          Ranking Winter 2025
        </h1>
      </div>
      <div className='grid grid-cols-5 gap-4'>
        {teamRanking.map(team => (
          <TeamTables
            key={team.id}
            team={team}
            players={players}
            onUpdatePlayerTier={handleUpdatePlayerTier}
            onUpdateTeamRank={handleUpdateTeamRank}
            hideChevron={true}
          />
        ))}
      </div>
      <p className="text-gray-400 text-xs text-right">@_RedSeeds  @than_ontweeter</p>  
    </div>

      <div className=''>
      
      <div className='px-4 py-4 flex items-center'>
        <img src={logo} alt="LFL_Logo" className='w-16' />
        <h1 className="text-2xl  text-white text-left mt-8 ml-4">
          Ranking Winter 2025
        </h1> 
        </div>
      <div className='grid md:grid-cols-5 gap-4 mx-auto'>
          {teamRanking.map(team => (
            <TeamTables
              key={team.id}
              team={team}
              players={players}
              onUpdatePlayerTier={handleUpdatePlayerTier}
              onUpdateTeamRank={handleUpdateTeamRank}
              hideChevron={false}
            />
          ))}

      </div>
      </div>
      <div className='flex'>
            <button onClick={saveAsPng}
            className="bg-[#251c0d] border text-white px-8 py-3 rounded-full flex items-start gap-2 hover:bg-[#15100c] transition-colors">
                <Save className="w-5 h-5" />
                Export
            </button>   
            {loading && <div className="spinner"></div>}
      </div>
      <p className="text-gray-400 text-xs text-right">@_RedSeeds  @than_ontweeter</p>  
    </div>
  );
};