/**
 * @deprecated Stop is deprecated, use schema version TrackStop
 */
export default interface Stop {
	start_date?: number;
	start_lat?: number;
	start_lon?: number;
	end_date?: number;
	end_lat?: number;
	end_lon?: number;
	duration?: number;
}
